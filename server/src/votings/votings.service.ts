import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voting } from './voting.entity';
import { VotesService } from '../votes/votes.service';
import { Candidate } from '../candidates/candidate.entity';

@Injectable()
export class VotingsService {
  constructor(
    @InjectRepository(Voting)
    private votingRepository: Repository<Voting>,
    private votesService: VotesService,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  async findAll() {
    return await this.votingRepository.find();
  }

  async findOne(id: number): Promise<VotingWithCandidates> {
    const voting = await this.votingRepository.findOne({ where: { id } });

    if (!voting) {
      throw new NotFoundException(`Voting with ID "${id}" not found`);
    }

    const candidates = await this.candidateRepository.find({
      where: { voting_id: id },
    });

    return { ...voting, candidates };
  }

  async getAvailable(user_id: number): Promise<Voting[]> {
    const userVotes = await this.votesService.findByUser(user_id);
    const votedIds = userVotes.map((v) => v.voting_id);

    let queryBuilder = this.votingRepository.createQueryBuilder('voting');

    queryBuilder.where('voting.isactive = :isactive', { isactive: true });

    if (votedIds.length > 0) {
      queryBuilder.andWhere('voting.id NOT IN (:...votedIds)', { votedIds });
    }

    return await queryBuilder.getMany();
  }

  async createWithCandidates(data: { 
    title: string; 
    isactive: boolean; 
    candidates?: { name: string }[] // Делаем опциональным
  }): Promise<Voting> {
    // 1. Создаем голосование
    const voting = await this.votingRepository.save({
      title: data.title,
      isactive: data.isactive
    });

    // 2. Создаем кандидатов (если они есть)
    if (data.candidates && data.candidates.length > 0) {
      const candidates = data.candidates.map(c => ({
        name: c.name,
        voting_id: voting.id
      }));
    
      await this.candidateRepository.save(candidates);
    }

    return voting;
  }

  async updateVoting(id: number, votingData: Partial<Voting>): Promise<Voting> {
    const voting = await this.votingRepository.findOne({ where: { id } });
    if (!voting) {
      throw new NotFoundException(`Voting with ID "${id}" not found`);
    }

    await this.votingRepository.update(id, votingData);
    const updatedVoting = await this.votingRepository.findOne({ where: { id } });
    if (!updatedVoting) {
      throw new NotFoundException(`Voting with ID "${id}" not found after update`);
    }
    return updatedVoting;
  }

  async getLeadingCandidates(votingId: number): Promise<Candidate[]> {
    const candidates = await this.candidateRepository.find({ where: { voting_id: votingId } });

    if (!candidates || candidates.length === 0) {
      return []; // Return empty array if no candidates found
    }

    // Fetch votes for each candidate
    const candidateVotes = await Promise.all(
      candidates.map(async (candidate) => {
        const voteCount = await this.votesService.countVotesForCandidate(candidate.id);
        return { candidate, voteCount };
      })
    );

    // Find the maximum number of votes
    const maxVotes = Math.max(...candidateVotes.map((cv) => cv.voteCount));

    // Filter candidates with the maximum number of votes
    const leadingCandidates = candidateVotes
      .filter((cv) => cv.voteCount === maxVotes)
      .map((cv) => cv.candidate);

    return leadingCandidates;
  }
}

export interface VotingWithCandidates extends Voting {
  candidates: Candidate[];
}