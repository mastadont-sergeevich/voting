// votings.module.ts
import { Module } from '@nestjs/common';
import { VotingsController } from './votings.controller';
import { VotingsService } from './votings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voting } from './voting.entity';
import { VotesModule } from '../votes/votes.module';
import { Candidate } from '../candidates/candidate.entity';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Voting, Candidate]), // Import TypeOrmModule.forFeature([Candidate])
    VotesModule,
    CandidatesModule,
  ],
  controllers: [VotingsController],
  providers: [VotingsService],
  exports: [VotingsService],
})
export class VotingsModule {}