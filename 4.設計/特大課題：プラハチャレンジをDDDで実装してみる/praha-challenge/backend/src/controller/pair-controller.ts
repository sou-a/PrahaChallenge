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
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { PairUseCase } from 'src/app/pair-usecase'
import { FindAllPairResponse } from './response/pair-response'
import { CreatePairRequest, PairUserRequest } from './request/pair-request'
import { UserId } from 'src/domain/user/user-id'
import { PairId } from 'src/domain/pair/pair-id'

@ApiTags('pairs')
@Controller({
  path: '/pairs',
})
export class PairController {
  @Get()
  @ApiResponse({ status: 200, type: FindAllPairResponse })
  async findAllUser(): Promise<FindAllPairResponse> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    const result = await usecase.findAll()
    const response = new FindAllPairResponse({ pairDTOs: result })
    return response
  }

  @Post()
  async createPair(@Body() pairDto: CreatePairRequest): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    await usecase.create({
      name: pairDto.name,
      userIds: pairDto.userIds.map((userId) => {
        return new UserId(userId)
      }),
    })
  }

  @Patch('add/:id')
  async addPairUser(
    @Param('id') id: string,
    @Body() pairDto: PairUserRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    await usecase.addPairUser({
      pairId: new PairId(id),
      userId: new UserId(pairDto.userId),
    })
  }

  @Patch('remove/:id')
  async removePairUser(
    @Param('id') id: string,
    @Body() pairDto: PairUserRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    await usecase.removePairUser({
      pairId: new PairId(id),
      userId: new UserId(pairDto.userId),
    })
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const prisma = new PrismaClient()
    const userRepository = new UserRepository(prisma)
    const pairRepository = new PairRepository(prisma)

    const usecase = new PairUseCase(pairRepository, userRepository)
    await usecase.delete({
      pairId: new PairId(id),
    })
  }
}
