import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/tasks/task.model';

export class UpdateTaskStatusDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
