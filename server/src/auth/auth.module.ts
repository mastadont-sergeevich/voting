import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/user.entity';  // Путь исправлен!

@Module({
  imports: [TypeOrmModule.forFeature([User])],  // Подключаем User для AuthService
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}