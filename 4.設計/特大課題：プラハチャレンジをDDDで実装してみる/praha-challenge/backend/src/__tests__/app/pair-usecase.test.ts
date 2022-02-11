import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { PairUseCase } from '../../app/pair-usecase'
import { PairDTO } from '../../app/dto/pair-dto'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { UserId } from 'src/domain/user/user-id'
import { PairId } from 'src/domain/pair/pair-id'
import { createPair } from '@testUtil/pair/pair-factory'
import { createUser } from '@testUtil/user/user-factory'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')
jest.mock('src/infra/db/repository/pair-repository')

describe('pair-usecase.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockPairRepo: MockedObjectDeep<PairRepository>
  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockPairRepo = mocked(new PairRepository(prisma), true)
  })
  describe('findAll', () => {
    it('[正常系]: DTOを返す', async () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      mockPairRepo.findAll.mockResolvedValueOnce([
        createPair({}),
        createPair({}),
      ])

      const pairDTOs = await usecase.findAll()
      pairDTOs.map((pairDTO) => {
        expect(pairDTO).toEqual(expect.any(PairDTO))
      })
    })
    it('[準正常系]: findAllで例外が発生した場合、例外が発生する', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      const ERROR_MESSAGE = 'error!'
      mockPairRepo.findAll.mockRejectedValueOnce(ERROR_MESSAGE)

      expect(usecase.findAll()).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('create', () => {
    it('[正常系]: DTOを返す', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      mockUserRepo.findById.mockResolvedValue(createUser({}))
      mockPairRepo.save.mockResolvedValueOnce(createPair({}))

      expect(
        usecase.create({
          name: 'a',
          userIds: [new UserId('1'), new UserId('2')],
        }),
      ).resolves.toEqual(expect.any(PairDTO))
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.findById.mockResolvedValueOnce(createUser({}))
      mockPairRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(
        usecase.create({
          name: 'a',
          userIds: [new UserId('1'), new UserId('2')],
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('addPairUser', () => {
    it('[正常系]: DTOを返す', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      mockUserRepo.findById.mockResolvedValueOnce(createUser({}))
      mockPairRepo.findById.mockResolvedValueOnce(createPair({}))
      mockPairRepo.save.mockResolvedValueOnce(createPair({}))

      return expect(
        usecase.addPairUser({
          pairId: new PairId('1'),
          userId: new UserId('1'),
        }),
      ).resolves.toEqual(expect.any(PairDTO))
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.findById.mockResolvedValueOnce(createUser({}))
      mockPairRepo.findById.mockResolvedValueOnce(createPair({}))
      mockPairRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(
        usecase.addPairUser({
          pairId: new PairId('1'),
          userId: new UserId('1'),
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('removePairUser', () => {
    it('[正常系]: DTOを返す', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      mockPairRepo.findById.mockResolvedValueOnce(createPair({}))
      mockPairRepo.save.mockResolvedValueOnce(createPair({}))

      return expect(
        usecase.removePairUser({
          pairId: new PairId('1'),
          userId: new UserId('1'),
        }),
      ).resolves.toEqual(expect.any(PairDTO))
    })
    it('[準正常系]: removePairUserで例外が発生した場合、例外が発生する', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      const ERROR_MESSAGE = 'error!'
      mockPairRepo.findById.mockResolvedValueOnce(createPair({}))
      mockPairRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(
        usecase.removePairUser({
          pairId: new PairId('1'),
          userId: new UserId('1'),
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      mockPairRepo.delete.mockResolvedValueOnce()

      return expect(usecase.delete({ pairId: new PairId('1') })).resolves.toBe(
        undefined,
      )
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      const ERROR_MESSAGE = 'error!'
      mockPairRepo.delete.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(
        usecase.delete({ pairId: new PairId('1') }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })
})
