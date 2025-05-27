// AuthService
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async auth(email: string, password: string): Promise<{ id: number; email: string; role: string } | string> {
    // Ищем пользователя
    const user = await this.userRepo.findOne({ where: { email } });

    // Если нет — создаём (пароль сохраняем как есть)
    if (!user) {
      const newUser = await this.userRepo.save({ email, password, role: 'user' });
      return { id: newUser.id, email: newUser.email, role: newUser.role }; // Возвращаем данные нового пользователя
    }

    // Если есть — проверяем пароль
    if (user.password === password) {
      return { id: user.id, email: user.email, role: user.role }; // Возвращаем данные существующего пользователя
    } else {
      return 'Wrong password!';
    }
  }
}