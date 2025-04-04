import { TaskStatus } from 'src/tasks/task.model';
// using class validator pipe
import { IsNotEmpty } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  status?: TaskStatus;
}
