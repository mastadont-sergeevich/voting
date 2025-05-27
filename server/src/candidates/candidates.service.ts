import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find();
  }

  async create(candidateData: { name: string; voting_id: number }): Promise<Candidate> {
    const candidate = this.candidateRepository.create(candidateData);
    return this.candidateRepository.save(candidate);
  }

  async findByVoting(votingId: number): Promise<Candidate[]> {
    return this.candidateRepository.find({ where: { voting_id: votingId } });
  }
}