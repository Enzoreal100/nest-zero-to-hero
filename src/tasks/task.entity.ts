import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: TaskStatus.OPEN })
  status: TaskStatus;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false }) // Eager means that if we will retrieve the tasks with the user
  @Exclude({ toPlainOnly: true })
  user: User;

  constructor(data: Partial<Task>) {
    Object.assign(this, data);
  }
}
