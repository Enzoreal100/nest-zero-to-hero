import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
  // importing the tasks.module.ts
})
export class AppModule {}
