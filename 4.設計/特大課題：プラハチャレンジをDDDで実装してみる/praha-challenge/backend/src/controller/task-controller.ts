import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { FindAllTaskResponse } from './response/task-response'
import { TaskUseCase } from 'src/app/task-usecase'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import {
  CreateTaskRequest,
  UpdateTaskStatusRequest,
  UpdateTaskGroupRequest,
} from './request/task-request'
import { UserId } from 'src/domain/user/user-id'
import { TaskId } from 'src/domain/task/task-id'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'

@ApiTags('tasks')
@Controller({
  path: '/tasks',
})
export class TaskController {
  @Get()
  @ApiResponse({ status: 200, type: FindAllTaskResponse })
  async findAllUser(): Promise<FindAllTaskResponse> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    const result = await usecase.findAll()
    const response = new FindAllTaskResponse({ taskDTOs: result })
    return response
  }

  @Post()
  async createUser(@Body() postTaskDto: CreateTaskRequest): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    await usecase.create({
      name: postTaskDto.name,
      taskGroupId: new TaskGroupId(postTaskDto.taskGroupId),
    })
  }

  @Patch(':id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() postTaskDto: UpdateTaskStatusRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    await usecase.changeStatus({
      taskId: new TaskId(id),
      userId: new UserId(postTaskDto.userId),
      status: postTaskDto.status,
    })
  }

  @Patch(':id/task-group')
  async updateTaskGroup(
    @Param('id') id: string,
    @Body() postTaskDto: UpdateTaskGroupRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    await usecase.changeTaskGroup({
      taskId: new TaskId(id),
      taskGroupId: new TaskGroupId(postTaskDto.taskGroupId),
    })
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const usecase = new TaskUseCase(taskRepository, userBelongTaskRepository)
    await usecase.delete({
      taskId: new TaskId(id),
    })
  }
}
