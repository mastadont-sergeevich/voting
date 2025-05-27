import { Controller, Get, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { VotingsService } from '../votings/votings.service';
import { Voting } from '../votings/voting.entity';

@Controller('admin/votings')
export class AdminController {
  constructor(private readonly votingsService: VotingsService) {}

  @Get()
  async getAllVotings(): Promise<Voting[]> {
    return this.votingsService.findAll();
  }

  @Put(':id')
  async updateVotingStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isactive: boolean }
  ): Promise<Voting> {
    return this.votingsService.updateVoting(id, { isactive: body.isactive });
  }
}