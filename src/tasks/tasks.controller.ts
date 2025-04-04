import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ITask } from './task.model';
import { CreateTaskDTO } from 'src/DTO/create-task.dto';
import { GetTasksFilterDTO } from 'src/DTO/get-task-filter.dto';
import { UpdateTaskStatusDTO } from 'src/DTO/update-task-status.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // Feature: Get All Tasks
  // controller is the entrypoint, communicate with the service and return result
  // When a Get request comes to /tasks, let this handler handle
  @Get()
  getTasks(@Query() filterDTO: GetTasksFilterDTO): ITask[] {
    // If we have any filters at all on query
    if (Object.keys(filterDTO).length) {
      return this.tasksService.getTasksWithFilters(filterDTO);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  // Specify param path
  @Get('/:id')
  getTaskById(@Param('id') id: string): ITask | undefined {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  deleteTask(@Param('id') uuid: string): void {
    return this.tasksService.deleteTask(uuid);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
  ): ITask | undefined {
    const { status } = updateTaskStatusDTO;
    return this.tasksService.updateTask(id, status);
  }

  @Post()
  // using cherrypick of the atribute we want and put it in the params of the func
  createTask(@Body() createTaskDTO: CreateTaskDTO): ITask {
    return this.tasksService.createTask(createTaskDTO);
  }
}
