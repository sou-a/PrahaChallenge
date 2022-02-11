import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { TaskGroupService } from 'src/domain/task-group/task-group-service'
import { TaskGroupDTO } from 'src/app/dto/task-group-dto'
import { TaskGroupUseCase } from 'src/app/task-group-usecase'
import { TaskGroupRepository } from 'src/infra/db/repository/task-group-repository'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { createTaskGroup } from '@testUtil/task-group/task-group-factory'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/task-group-repository')
jest.mock('src/domain/task-group/task-group-service')

describe('task-group-usecase.ts', () => {
  let mockTaskRepo: MockedObjectDeep<TaskRepository>
  let mockTaskGroupRepo: MockedObjectDeep<TaskGroupRepository>
  let mockTaskGroupService: MockedObjectDeep<TaskGroupService>
  let mockUserBelongTaskRepo: MockedObjectDeep<UserBelongTaskRepository>

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockTaskRepo = mocked(new TaskRepository(prisma), true)
    mockTaskGroupRepo = mocked(new TaskGroupRepository(prisma), true)
    mockUserBelongTaskRepo = mocked(new UserBelongTaskRepository(prisma), true)
    mockTaskGroupService = mocked(
      new TaskGroupService({
        taskGroupRepository: mockTaskGroupRepo,
        taskRepository: mockTaskRepo,
        userBelongTaskRepository: mockUserBelongTaskRepo,
      }),
      true,
    )
  })
  describe('findAll', () => {
    it('[正常系]: DTOを返す', async () => {
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      mockTaskGroupRepo.findAll.mockResolvedValueOnce([
        createTaskGroup({}),
        createTaskGroup({}),
      ])
      const taskGroupDTOs = await usecase.findAll()
      taskGroupDTOs.map((taskGroupDTO) => {
        return expect(taskGroupDTO).toEqual(expect.any(TaskGroupDTO))
      })
    })
    it('[準正常系]: findAllで例外が発生した場合、例外が発生する', () => {
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      const ERROR_MESSAGE = 'error!'
      mockTaskGroupRepo.findAll.mockRejectedValueOnce(ERROR_MESSAGE)
      return expect(usecase.findAll()).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('create', () => {
    it('[正常系]: DTOを返す', () => {
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      mockTaskGroupRepo.save.mockResolvedValueOnce(createTaskGroup({}))
      return expect(
        usecase.create({
          name: 'task1',
        }),
      ).resolves.toEqual(expect.any(TaskGroupDTO))
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockTaskGroupRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(
        usecase.create({
          name: 'task1',
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('changeName', () => {
    it('[正常系]: 例外が発生しない', () => {
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      mockTaskGroupRepo.findById.mockResolvedValueOnce(createTaskGroup({}))
      mockTaskGroupRepo.save.mockResolvedValueOnce(createTaskGroup({}))

      return expect(
        usecase.changeName({
          taskGroupId: new TaskGroupId('1'),
          name: 'name1',
        }),
      ).resolves.toEqual(expect.any(TaskGroupDTO))
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockTaskGroupRepo.findById.mockResolvedValueOnce(createTaskGroup({}))
      mockTaskGroupRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(
        usecase.changeName({
          taskGroupId: new TaskGroupId('1'),
          name: 'name1',
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', () => {
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      mockTaskGroupRepo.findById.mockResolvedValueOnce(createTaskGroup({}))
      mockTaskGroupService.delete.mockResolvedValueOnce()

      return expect(
        usecase.delete({ taskGroupId: new TaskGroupId('1') }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockTaskGroupRepo.findById.mockResolvedValueOnce(createTaskGroup({}))
      mockTaskGroupService.delete.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(
        usecase.delete({ taskGroupId: new TaskGroupId('1') }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })
})
