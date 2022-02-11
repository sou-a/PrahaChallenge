import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import {
  FindAllUserResponse,
  FindUsersByTasksResponse,
} from './response/user-response'
import {
  CreateUserRequest,
  UpdateUserStatusRequest,
} from './request/user-request'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { UserUseCase } from 'src/app/user-usecase'
import { UserService } from 'src/domain/user/user-service'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { TeamService } from 'src/domain/team/team-service'
import { UserQS } from 'src/infra/db/query-service/user-qs'
import { UserId } from 'src/domain/user/user-id'
import { TaskId } from 'src/domain/task/task-id'
import { UserFactory } from 'src/domain/user/user-factory'

@ApiTags('users')
@Controller({
  path: '/users',
})
export class UserController {
  @Get()
  @ApiResponse({ status: 200, type: FindAllUserResponse })
  async findAllUser(): Promise<FindAllUserResponse> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const userFactory = new UserFactory({ userRepository })
    const pairRepository = new PairRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const userQS = new UserQS(prisma)
    const userService = new UserService({
      userRepository,
      pairRepository,
      teamRepository,
      teamService,
    })
    const usecase = new UserUseCase(
      userRepository,
      userFactory,
      userService,
      userQS,
    )
    const result = await usecase.findAll()
    const response = new FindAllUserResponse({ userDTOs: result })
    return response
  }

  @Get('/page')
  @ApiResponse({ status: 200, type: FindUsersByTasksResponse })
  async findUsersByTasks(
    @Query('taskIds') taskIds: string[],
    @Query('taskStatus') taskStatus: string,
    @Query('page') page: number,
  ): Promise<FindUsersByTasksResponse> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const userFactory = new UserFactory({ userRepository })
    const pairRepository = new PairRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const userQS = new UserQS(prisma)
    const userService = new UserService({
      userRepository,
      pairRepository,
      teamRepository,
      teamService,
    })
    const usecase = new UserUseCase(
      userRepository,
      userFactory,
      userService,
      userQS,
    )
    if (typeof taskIds === 'string') {
      taskIds = [taskIds]
    }
    const result = await usecase.findUsersByTasks({
      taskIds: taskIds.map((taskId) => {
        return new TaskId(taskId)
      }),
      taskStatus,
      page,
    })
    const response = new FindUsersByTasksResponse({ userDTOs: result })
    return response
  }

  @Post()
  async createUser(@Body() postUserDto: CreateUserRequest): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const userFactory = new UserFactory({ userRepository })
    const pairRepository = new PairRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const userQS = new UserQS(prisma)
    const userService = new UserService({
      userRepository,
      pairRepository,
      teamRepository,
      teamService,
    })
    const usecase = new UserUseCase(
      userRepository,
      userFactory,
      userService,
      userQS,
    )
    await usecase.create({
      name: postUserDto.name,
      mailAddress: postUserDto.mailAddress,
      status: postUserDto.status,
    })
  }

  @Patch(':id')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() postUserDto: UpdateUserStatusRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const userFactory = new UserFactory({ userRepository })
    const pairRepository = new PairRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const userQS = new UserQS(prisma)
    const userService = new UserService({
      userRepository,
      pairRepository,
      teamRepository,
      teamService,
    })
    const usecase = new UserUseCase(
      userRepository,
      userFactory,
      userService,
      userQS,
    )
    await usecase.changeStatus({
      userId: new UserId(id),
      status: postUserDto.status,
    })
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const userFactory = new UserFactory({ userRepository })
    const pairRepository = new PairRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const userQS = new UserQS(prisma)
    const userService = new UserService({
      userRepository,
      pairRepository,
      teamRepository,
      teamService,
    })
    const usecase = new UserUseCase(
      userRepository,
      userFactory,
      userService,
      userQS,
    )
    await usecase.delete({
      userId: new UserId(id),
    })
  }
}
