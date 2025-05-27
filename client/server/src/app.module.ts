import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
//import { UsersModule } from './users/users.module';
import { Vote } from './votes/vote.entity';
import { VotesModule } from './votes/votes.module';
import { Voting } from './votings/voting.entity';
import { VotingsModule } from './votings/votings.module';
import { Candidate } from './candidates/candidate.entity';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-d0jc2fm3jp1c739ol2o0-a.oregon-postgres.render.com',
      port: 5432,
      username: 'voting_db_83mu_user',
      password: '7TeLOvifBBzoqLtPccGHsQvGUuYbxnpM',
      database: 'voting_db_83mu',
      entities: [
        User,
        Vote,
        Voting,
        Candidate 
      ],
      synchronize: false, 
      ssl: { rejectUnauthorized: false },
    }),
    AuthModule,
    VotingsModule,
    VotesModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}