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
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import {
  CreateTaskGroupRequest,
  updateNameRequest,
} from './request/task-group-request'
import { TaskGroupUseCase } from 'src/app/task-group-usecase'
import { TaskGroupRepository } from 'src/infra/db/repository/task-group-repository'
import { TaskGroupService } from 'src/domain/task-group/task-group-service'
import { FindAllTaskGroupResponse } from './response/task-group-response'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'

@ApiTags('task-groups')
@Controller({
  path: '/task-groups',
})
export class TaskGroupController {
  @Get()
  @ApiResponse({ status: 200, type: FindAllTaskGroupResponse })
  async findAllTaskGroup(): Promise<FindAllTaskGroupResponse> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const taskGroupRepository = new TaskGroupRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const taskGroupService = new TaskGroupService({
      taskGroupRepository,
      taskRepository,
      userBelongTaskRepository,
    })
    const usecase = new TaskGroupUseCase(taskGroupRepository, taskGroupService)
    const result = await usecase.findAll()
    const response = new FindAllTaskGroupResponse({ taskGroupDTOs: result })
    return response
  }

  @Post()
  async CreateTaskGroup(
    @Body() postTaskGroupDto: CreateTaskGroupRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const taskGroupRepository = new TaskGroupRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const taskGroupService = new TaskGroupService({
      taskGroupRepository,
      taskRepository,
      userBelongTaskRepository,
    })
    const usecase = new TaskGroupUseCase(taskGroupRepository, taskGroupService)
    await usecase.create({
      name: postTaskGroupDto.name,
    })
  }

  @Patch(':id')
  async updateName(
    @Param('id') id: string,
    @Body() postTaskGroupDto: updateNameRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const taskGroupRepository = new TaskGroupRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const taskGroupService = new TaskGroupService({
      taskGroupRepository,
      taskRepository,
      userBelongTaskRepository,
    })
    const usecase = new TaskGroupUseCase(taskGroupRepository, taskGroupService)
    await usecase.changeName({
      taskGroupId: new TaskGroupId(id),
      name: postTaskGroupDto.name,
    })
  }

  @Delete(':id')
  async deleteTaskGroup(@Param('id') id: string): Promise<void> {
    const prisma = new PrismaClient()
    const taskRepository = new TaskRepository(prisma)
    const taskGroupRepository = new TaskGroupRepository(prisma)
    const userBelongTaskRepository = new UserBelongTaskRepository(prisma)
    const taskGroupService = new TaskGroupService({
      taskGroupRepository,
      taskRepository,
      userBelongTaskRepository,
    })
    const usecase = new TaskGroupUseCase(taskGroupRepository, taskGroupService)
    await usecase.delete({
      taskGroupId: new TaskGroupId(id),
    })
  }
}
