import { UserBelongTask } from 'src/domain/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/user-belong-task/task-status'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import { UserId } from 'src/domain/user/user-id'
import { TaskId } from 'src/domain/task/task-id'
import { prisma } from '@testUtil/prisma'
import { seedTaskGroup } from '@testUtil/task-group/seed-task-group'
import { seedAllTaskStatus } from '@testUtil/task-status-factory'
import { seedTask } from '@testUtil/task/seed-task'
import { seedUserBelongTask } from '@testUtil/user-belong-task/seed-user-belong-task'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { seedUser } from '@testUtil/user/seed-user'

describe('user-belong-task-repository.integration.ts', () => {
  const userBelongTaskRepo = new UserBelongTaskRepository(prisma)
  beforeEach(async () => {
    await prisma.taskUser.deleteMany()
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()
    await prisma.taskUserStatus.deleteMany()
  })
  afterAll(async () => {
    await prisma.taskUser.deleteMany()
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()
    await prisma.taskUserStatus.deleteMany()

    await prisma.$disconnect()
  })

  describe('findAll', () => {
    it('[正常系]userBelongTaskを全て取得できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '2', taskId: '1' })

      const userBelongTasks = await userBelongTaskRepo.findAll()
      expect(userBelongTasks).toHaveLength(2)
      userBelongTasks.map((userBelongTask) => {
        expect(userBelongTask).toEqual(expect.any(UserBelongTask))
      })
    })
  })

  describe('findByUserId', () => {
    it('[正常系]特定のuserIdのuserBelongTaskを取得できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '2', taskId: '1' })

      const userBelongTasks = await userBelongTaskRepo.findByUserId(
        new UserId('1'),
      )
      expect(userBelongTasks[0]).toEqual(expect.any(UserBelongTask))
      expect(userBelongTasks[0]).toEqual({
        userId: new UserId('1'),
        taskId: new TaskId('1'),
        status: expect.any(TaskStatus),
      })
    })
  })

  describe('save', () => {
    it('[正常系]userBelongTaskを保存できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedUser({ id: '1' })

      const userBelongTaskExpected = {
        userId: new UserId('1'),
        taskId: new TaskId('1'),
        status: new TaskStatus(TaskStatus.notYet),
      }
      await userBelongTaskRepo.save(new UserBelongTask(userBelongTaskExpected))

      const userBelongTasks = await prisma.taskUser.findMany()
      expect(userBelongTasks).toHaveLength(1)
      userBelongTasks.map((userBelongTask) => {
        expect(userBelongTask).toEqual({
          userId: '1',
          taskId: '1',
          taskUserStatusId: expect.any(String),
        })
      })
    })
  })

  describe('deleteByTaskId', () => {
    it('[正常系]特定のtaskIdのuserBelongTaskを削除できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '2', taskId: '1' })
      await seedUserBelongTask({ userId: '1', taskId: '2' })

      await userBelongTaskRepo.deleteByTaskId(new TaskId('1'))
      const userBelongTasks = await prisma.taskUser.findMany()
      expect(userBelongTasks).toHaveLength(1)
      userBelongTasks.map((userBelongTask) => {
        expect(userBelongTask).toEqual({
          userId: '1',
          taskId: '2',
          taskUserStatusId: expect.any(String),
        })
      })
    })
  })

  describe('deleteByUserId', () => {
    it('[正常系]特定のuserIdのuserBelongTaskを削除できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '1', taskId: '2' })
      await seedUserBelongTask({ userId: '2', taskId: '1' })

      await userBelongTaskRepo.deleteByUserId(new UserId('1'))
      const userBelongTasks = await prisma.taskUser.findMany()
      expect(userBelongTasks).toHaveLength(1)
      userBelongTasks.map((userBelongTask) => {
        expect(userBelongTask).toEqual({
          userId: '2',
          taskId: '1',
          taskUserStatusId: expect.any(String),
        })
      })
    })
  })
})
