import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('votings')
export class Voting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: true })
  isactive: boolean;
}