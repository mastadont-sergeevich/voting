import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { VotingsService } from './votings.service';
import { Voting } from './voting.entity';
import { Candidate } from '../candidates/candidate.entity';

@Controller('votings')
export class VotingsController {
  constructor(private readonly votingsService: VotingsService) {}

  @Get()
  async findAll(): Promise<Voting[]> {
    return this.votingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Voting> {
    try {
      return await this.votingsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { isactive: boolean }
  ): Promise<Voting> {
    return this.votingsService.updateVoting(id, data);
  }


  @Get('available/:userId')
  async getAvailable(@Param('userId', ParseIntPipe) userId: number): Promise<Voting[]> {
    return this.votingsService.getAvailable(userId);
  }

  @Post()
  async create(
    @Body() data: { title: string; isactive?: boolean; candidates?: { name: string }[] }
  ): Promise<Voting> {
    const createData = {
      title: data.title,
      isactive: data.isactive ?? true,
      candidates: data.candidates || []
    };
    return this.votingsService.createWithCandidates(createData);
  }

  @Get(':id/leaders')
  async getLeadingCandidates(@Param('id', ParseIntPipe) id: number): Promise<Candidate[]> {
    return this.votingsService.getLeadingCandidates(id);
  }
}