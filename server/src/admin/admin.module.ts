import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { VotingsModule } from '../votings/votings.module';

@Module({
  imports: [VotingsModule],
  controllers: [AdminController],
})
export class AdminModule {}