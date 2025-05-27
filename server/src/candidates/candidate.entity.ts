import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  voting_id: number; // Просто ID голосования (без связей)
}