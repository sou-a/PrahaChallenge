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
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { CreatePairRequest, PairUserRequest } from './request/pair-request'
import { TeamUseCase } from 'src/app/team-usecase'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { TeamService } from 'src/domain/team/team-service'
import { TeamFactory } from 'src/domain/team/team-factory'
import { FindAllTeamResponse } from './response/team-response'
import { UserId } from 'src/domain/user/user-id'
import { TeamId } from 'src/domain/team/team-id'

@ApiTags('teams')
@Controller({
  path: '/teams',
})
export class TeamController {
  @Get()
  @ApiResponse({ status: 200, type: FindAllTeamResponse })
  async findAllUser(): Promise<FindAllTeamResponse> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const teamFactory = new TeamFactory({ teamRepository })

    const usecase = new TeamUseCase(
      teamRepository,
      userRepository,
      teamService,
      teamFactory,
    )
    const result = await usecase.findAll()
    const response = new FindAllTeamResponse({ teamDTOs: result })
    return response
  }

  @Post()
  async createUser(@Body() teamDto: CreatePairRequest): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const teamFactory = new TeamFactory({ teamRepository })

    const usecase = new TeamUseCase(
      teamRepository,
      userRepository,
      teamService,
      teamFactory,
    )
    await usecase.create({
      name: teamDto.name,
      userIds: teamDto.userIds.map((userId) => {
        return new UserId(userId)
      }),
    })
  }

  @Patch('add/:id')
  async addPairUser(
    @Param('id') id: string,
    @Body() teamDto: PairUserRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const teamFactory = new TeamFactory({ teamRepository })

    const usecase = new TeamUseCase(
      teamRepository,
      userRepository,
      teamService,
      teamFactory,
    )
    await usecase.createTeamUser({
      teamId: new TeamId(id),
      userId: new UserId(teamDto.userId),
    })
  }

  @Patch('remove/:id')
  async removePairUser(
    @Param('id') id: string,
    @Body() teamDto: PairUserRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const teamFactory = new TeamFactory({ teamRepository })

    const usecase = new TeamUseCase(
      teamRepository,
      userRepository,
      teamService,
      teamFactory,
    )
    await usecase.deleteTeamUser({
      teamId: new TeamId(id),
      userId: new UserId(teamDto.userId),
    })
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const teamRepository = new TeamRepository(prisma)
    const teamService = new TeamService({ teamRepository, userRepository })
    const teamFactory = new TeamFactory({ teamRepository })

    const usecase = new TeamUseCase(
      teamRepository,
      userRepository,
      teamService,
      teamFactory,
    )
    await usecase.delete({
      teamId: new TeamId(id),
    })
  }
}
