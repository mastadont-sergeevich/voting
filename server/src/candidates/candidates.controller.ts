import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Candidate } from './candidate.entity';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get()
  async findAll(): Promise<Candidate[]> {
    return this.candidatesService.findAll();
  }

  @Get(':votingId')
  async findByVoting(@Param('votingId', ParseIntPipe) votingId: number): Promise<Candidate[]> {
    return this.candidatesService.findByVoting(votingId);
  }

  @Post()
  async create(@Body() candidateData: { name: string; voting_id: number }): Promise<Candidate> {
    return this.candidatesService.create(candidateData);
  }
}