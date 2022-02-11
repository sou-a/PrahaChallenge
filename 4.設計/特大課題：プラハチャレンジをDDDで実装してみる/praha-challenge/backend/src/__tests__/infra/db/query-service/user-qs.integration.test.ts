import { UserQS } from '../../../../infra/db/query-service/user-qs'
import { TaskStatus } from 'src/domain/user-belong-task/task-status'
import { UserDTO } from 'src/app/dto/user-dto'
import { prisma } from '@testUtil/prisma'
import { seedTaskGroup } from '@testUtil/task-group/seed-task-group'
import { seedAllTaskStatus } from '@testUtil/task-status-factory'
import { seedTask } from '@testUtil/task/seed-task'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { TaskId } from 'src/domain/task/task-id'

describe('user-qs.ts', () => {
  const userQS = new UserQS(prisma)
  beforeEach(async () => {
    await prisma.taskUser.deleteMany()
    await prisma.user.deleteMany()
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
    await prisma.taskUserStatus.deleteMany()
    await prisma.userStatus.deleteMany()
  })
  afterAll(async () => {
    await prisma.taskUser.deleteMany()
    await prisma.user.deleteMany()
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
    await prisma.taskUserStatus.deleteMany()
    await prisma.userStatus.deleteMany()

    await prisma.$disconnect()
  })

  describe('findUsersByTasks', () => {
    it('[正常系]「特定の課題（複数可能）」が「特定の進捗ステータス」になっている参加者の一覧を、10人単位でページングして取得する', async () => {
      /**
       * [テストデータ]
       * 課題１と課題２が存在
       * 各課題をもつユーザーが２０人存在
       * 各課題のうち、１０人が「未着手」ステータス、残りの１０人が「レビュー待ち」ステータスをもつ
       *
       */
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })

      // 課題１が「未着手」のユーザーを１０人作成
      for (let index = 1; index <= 10; index++) {
        const id = `${index}`
        const user = {
          id,
          name: `user${index}`,
          mailAddress: `${index}sample@example.com`,
          userStatusId: '1',
        }
        await prisma.user.createMany({ data: user })

        const userBelongTask = {
          userId: id,
          taskId: '1',
          taskUserStatusId: '1',
        }
        await prisma.taskUser.createMany({ data: userBelongTask })
      }
      // 課題１が「レビュー待ち」のユーザーを１０人作成
      for (let index = 11; index <= 20; index++) {
        const id = `${index}`
        const user = {
          id,
          name: `user${index}`,
          mailAddress: `${index}sample@example.com`,
          userStatusId: '1',
        }
        await prisma.user.createMany({ data: user })

        const userBelongTask = {
          userId: id,
          taskId: '1',
          taskUserStatusId: '2',
        }
        await prisma.taskUser.createMany({ data: userBelongTask })
      }
      // 課題２が「未着手」のタスクユーザーを１０人作成
      for (let index = 1; index <= 5; index++) {
        const id = `${index}`
        const userBelongTask = {
          userId: id,
          taskId: '2',
          taskUserStatusId: '1',
        }
        await prisma.taskUser.createMany({ data: userBelongTask })
      }
      for (let index = 16; index <= 20; index++) {
        const id = `${index}`
        const userBelongTask = {
          userId: id,
          taskId: '2',
          taskUserStatusId: '1',
        }
        await prisma.taskUser.createMany({ data: userBelongTask })
      }
      // 課題２が「レビュー待ち」のタスクユーザーを１０人作成
      for (let index = 6; index <= 15; index++) {
        const id = `${index}`
        const userBelongTask = {
          userId: id,
          taskId: '2',
          taskUserStatusId: '2',
        }
        await prisma.taskUser.createMany({ data: userBelongTask })
      }

      let usertDTOs = await userQS.findUsersByTasks({
        taskIds: [new TaskId('1')],
        taskStatus: TaskStatus.notYet,
        page: 1,
      })
      expect(usertDTOs).toHaveLength(10)
      usertDTOs.map((usertDTO) => {
        expect(usertDTO).toEqual(expect.any(UserDTO))
      })

      usertDTOs = await userQS.findUsersByTasks({
        taskIds: [new TaskId('1')],
        taskStatus: TaskStatus.notYet,
        page: 2,
      })
      expect(usertDTOs).toHaveLength(0)

      usertDTOs = await userQS.findUsersByTasks({
        taskIds: [new TaskId('1')],
        taskStatus: TaskStatus.review,
        page: 1,
      })
      expect(usertDTOs).toHaveLength(10)
      usertDTOs.map((usertDTO) => {
        expect(usertDTO).toEqual(expect.any(UserDTO))
      })

      usertDTOs = await userQS.findUsersByTasks({
        taskIds: [new TaskId('1')],
        taskStatus: TaskStatus.review,
        page: 2,
      })
      expect(usertDTOs).toHaveLength(0)

      usertDTOs = await userQS.findUsersByTasks({
        taskIds: [new TaskId('1'), new TaskId('2')],
        taskStatus: TaskStatus.notYet,
        page: 1,
      })
      expect(usertDTOs).toHaveLength(5)
      usertDTOs.map((usertDTO) => {
        expect(usertDTO).toEqual(expect.any(UserDTO))
      })

      usertDTOs = await userQS.findUsersByTasks({
        taskIds: [new TaskId('1'), new TaskId('2')],
        taskStatus: TaskStatus.review,
        page: 1,
      })
      expect(usertDTOs).toHaveLength(5)
      usertDTOs.map((usertDTO) => {
        expect(usertDTO).toEqual(expect.any(UserDTO))
      })

      usertDTOs = await userQS.findUsersByTasks({
        taskIds: [new TaskId('1'), new TaskId('2')],
        taskStatus: TaskStatus.complete,
        page: 1,
      })
      expect(usertDTOs).toHaveLength(0)

      usertDTOs = await userQS.findUsersByTasks({
        taskIds: [new TaskId('1'), new TaskId('2')],
        taskStatus: TaskStatus.notYet,
        page: 2,
      })
      expect(usertDTOs).toHaveLength(0)
    })
  })
})
