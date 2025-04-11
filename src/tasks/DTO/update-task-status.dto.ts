import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/tasks/task-status.enum';

export class UpdateTaskStatusDTO {
  @IsEnum(TaskStatus)
  @ApiProperty({ enum: TaskStatus })
  status: TaskStatus;
}
