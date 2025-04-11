import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDTO } from 'src/tasks/DTO/create-task.dto';
import { UpdateTaskStatusDTO } from 'src/tasks/DTO/update-task-status.dto';
import { GetTasksFilterDTO } from 'src/tasks/DTO/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
  constructor(private tasksService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.warn('running getTaskById');
    return this.tasksService.getTaskById(id, user);
  }

  @Get()
  getTasks(
    @Query() filterDTO: GetTasksFilterDTO,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.warn('running getTasksWithFilter');
    return this.tasksService.getTasks(filterDTO, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') uuid: string,
    @GetUser() user: User,
  ): Promise<string> {
    this.logger.warn('rodando deleteTask');
    return this.tasksService.deleteTask(uuid, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.warn('running updateTask');
    const { status } = updateTaskStatusDTO;
    return this.tasksService.updateTask(id, status, user);
  }

  @Patch('/toggle-active/:id')
  toggleTaskActive(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<string> {
    this.logger.warn('running toggleTaskActive');
    return this.tasksService.toggleTaskActive(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.warn('running createTask');
    return this.tasksService.createTask(createTaskDTO, user);
  }

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!OLD CODE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // .
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
}
