import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  async create(createVoteDto: any): Promise<Vote> {
    const vote = this.voteRepository.create({
      user_id: createVoteDto.user_id,
      candidate_id: createVoteDto.candidate_id,
      voting_id: createVoteDto.voting_id, // Используем votingId из createVoteDto
    });
    return this.voteRepository.save(vote);
  }

  async findByUser(user_id: number): Promise<Vote[]> {
    return this.voteRepository.find({ where: { user_id } });
  }

  async countVotesForCandidate(candidateId: number): Promise<number> {
    return this.voteRepository.count({ where: { candidate_id: candidateId } });
  }
}