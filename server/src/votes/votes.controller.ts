import { Controller, Post, Body } from '@nestjs/common';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  async create(@Body() createVoteDto: any) { // Изменили на any
    return this.votesService.create(createVoteDto);
  }
}