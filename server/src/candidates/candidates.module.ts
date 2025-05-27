import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './candidate.entity';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  controllers: [CandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService] // Если сервис будет использоваться в других модулях
})
export class CandidatesModule {}