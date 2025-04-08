import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDTO } from 'src/DTO/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }
  // Feature: Get All Tasks
  // controller is the entrypoint, communicate with the service and return result
  // When a Get request comes to /tasks, let this handler handle
  // @Get()
  // getTasks(@Query() filterDTO: GetTasksFilterDTO): ITask[] {
  //   // If we have any filters at all on query
  //   if (Object.keys(filterDTO).length) {
  //     return this.tasksService.getTasksWithFilters(filterDTO);
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }

  // // Specify param path
  // @Get('/:id')
  // getTaskById(@Param('id') id: string): ITask | undefined {
  //   return this.tasksService.getTaskById(id);
  // }

  // @Delete('/:id')
  // deleteTask(@Param('id') uuid: string): void {
  //   return this.tasksService.deleteTask(uuid);
  // }

  // @Patch('/:id/status')
  // updateTask(
  //   @Param('id') id: string,
  //   @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
  // ): ITask | undefined {
  //   const { status } = updateTaskStatusDTO;
  //   return this.tasksService.updateTask(id, status);
  // }

  @Post()
  // using cherrypick of the atribute we want and put it in the params of the func
  createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }
}
