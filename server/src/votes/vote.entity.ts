import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("votes")
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number; // ID пользователя

  @Column()
  candidate_id: number; // ID кандидата

  @Column()
  voting_id: number; // ID голосования
}