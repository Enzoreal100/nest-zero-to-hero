import { Injectable, NotFoundException } from '@nestjs/common';
import { ITask, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDTO } from 'src/DTO/create-task.dto';
import { GetTasksFilterDTO } from 'src/DTO/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

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
        /* Pode customizar a mensagem de erro */ 'Task não achada',
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
}
