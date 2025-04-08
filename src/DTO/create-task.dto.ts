import { TaskStatus } from 'src/tasks/task-status.enum';
// using class validator pipe
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  status?: TaskStatus;
}
