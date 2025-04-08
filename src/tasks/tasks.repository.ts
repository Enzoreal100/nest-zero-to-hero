import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';

export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
}

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {}
