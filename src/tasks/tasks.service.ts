import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from 'src/tasks/DTO/create-task.dto';
import { Not, Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from 'src/tasks/DTO/get-task-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private readonly logger: Logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } }); // TypeORM method for finding a single entity with an option;

    if (!found) {
      this.logger.error(`TASK WITH ID ${id} NOT FOUND FOR THE USER`);
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    this.logger.log(`TASK WITH ID ${id} FOUND`);
    return found;
  }

  async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { status, search } = filterDTO;
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.isActive') // TypeORM method for creating a query builder
      .andWhere({ user });

    if (status) {
      query.andWhere({ status }); // TypeORM method for adding a where clause to the query
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      ); // TypeORM method for adding a where clause to the query
    }

    const tasks = await query.getMany(); // TypeORM method for getting many entities
    if (!tasks) {
      this.logger.error('TASK WITH FILTERS NOT FOUND FOR THE USER');
      throw new NotFoundException();
    }
    this.logger.log(`TASKS FROM THE USER ${user.id} FOUND`);
    return tasks; // return the filtered tasks
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description, status } = createTaskDTO;
    const task = this.tasksRepository.create({
      // create new task object
      title,
      description,
      status,
      user,
    });

    await this.tasksRepository.save(task); // save task to the database
    this.logger.log(`NEW TASK CREATED BY ${user.id}`);
    return task; // return the created task
  }

  async deleteTask(id: string, user: User): Promise<string> {
    await this.getTaskById(id, user); // get the task by id
    await this.tasksRepository.delete({ id, user }); // delete the task from the database
    this.logger.log(`TASK WITH ID ${id} DELETED SUCCESSFULLY`);
    return `Task with id ${id} removed from database`;
  }

  async updateTask(
    id: string,
    newStatus: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user); // get the task by id
    task.status = newStatus; // update the status of the task
    await this.tasksRepository.save(task); // save the updated task to the database
    this.logger.log(`TASK WITH ID ${id} UPDATED`);
    return task; // return the updated task
  }

  async toggleTaskActive(id: string, user: User): Promise<string> {
    const task = await this.getTaskById(id, user);
    task.isActive = !task.isActive;
    await this.tasksRepository.save(task);
    this.logger.log(`TASK WITH ID ${id} STATUS TOGGLED`)
    return `Task active property toggled to ${task.isActive}`;
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!OLD CODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // .
  /* private tasks: ITask[] = [];

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO): ITask[] {
    const { status, search } = filterDTO;
    let tasks = this.getAllTasks();

    status.toUpperCase();
    if (status) {
      tasks = tasks.filter((elem) => elem.status === status);
    }

    if (search) {
      tasks = tasks.filter((elem) => {
        if (elem.title.includes(search) || elem.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  getTaskById(uuid: string): ITask | undefined {
    const found = this.tasks.find((task) => task.id === uuid);
    if (!found) {
      throw new NotFoundException(
        Pode customizar a mensagem de erro  'Task não achada',
      );
    }
    return found;
  }

  // Feature: Create a new task and send it;
  createTask(createTaskDTO: CreateTaskDTO): ITask {
    const { title, description, status } = createTaskDTO;
    const task: ITask = {
      id: uuid(),
      title,
      description,
      status: status || TaskStatus.OPEN,
    };
    this.tasks.push(task);

    return task;
  }

  deleteTask(uuid: string): void {
    const found = this.getTaskById(uuid);
    this.tasks = this.tasks.filter((elem) => elem.id === found.id);
  }

  updateTask(id: string, newStatus: TaskStatus): ITask | undefined {
    newStatus.toUpperCase();
    const task = this.getTaskById(id);
    if (task) {
      task.status = newStatus;
      return task;
    }
  }
  */
}
