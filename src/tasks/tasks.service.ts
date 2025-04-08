import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { CreateTaskDTO } from 'src/DTO/create-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id } }); // TypeORM method for finding a single entity with an option;

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = this.tasksRepository.create({
      // create new task object
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(task); // save task to the database
    return task; // return the created task
  }
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
