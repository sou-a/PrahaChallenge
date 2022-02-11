import { createRandomIdString } from 'src/util/random'
import { Task } from 'src/domain/task/task'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { TaskId } from 'src/domain/task/task-id'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { prisma } from '@testUtil/prisma'
import { seedTaskGroup } from '@testUtil/task-group/seed-task-group'
import { seedTask } from '@testUtil/task/seed-task'

describe('task-repository.integration.ts', () => {
  const taskRepo = new TaskRepository(prisma)
  beforeEach(async () => {
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
  })
  afterAll(async () => {
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()

    await prisma.$disconnect()
  })

  describe('findAll', () => {
    it('[正常系]taskを全て取得できる', async () => {
      await seedTaskGroup({ id: '1' })
      await seedTask({ taskGroupId: '1' })
      await seedTask({ taskGroupId: '1' })

      const tasks = await taskRepo.findAll()
      expect(tasks).toHaveLength(2)
      tasks.map((task) => {
        expect(task).toEqual(expect.any(Task))
      })
    })
  })

  describe('findById', () => {
    it('[正常系]特定のidのtaskを取得できる', async () => {
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })

      const task = await taskRepo.findById(new TaskId('1'))
      expect(task).toEqual(expect.any(Task))
      expect(task).toEqual({
        id: new TaskId('1'),
        taskGroupId: new TaskGroupId('1'),
        name: expect.any(String),
      })
    })
  })

  describe('save', () => {
    it('[正常系]taskを保存できる', async () => {
      await seedTaskGroup({ id: '1' })
      const taskExpected = {
        id: new TaskId(createRandomIdString()),
        taskGroupId: new TaskGroupId('1'),
        name: 'task1',
      }
      await taskRepo.save(new Task(taskExpected))

      const tasks = await prisma.task.findMany()
      expect(tasks).toHaveLength(1)
      tasks.map((task) => {
        expect(task).toEqual({
          id: expect.anything(),
          taskGroupId: '1',
          name: 'task1',
        })
      })
    })
  })

  describe('delete', () => {
    it('[正常系]特定のidのtaskを削除できる', async () => {
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })

      await taskRepo.delete(new TaskId('1'))
      const tasks = await prisma.task.findMany()
      tasks.map((task) => {
        expect(task).toEqual({
          id: '2',
          taskGroupId: '1',
          name: expect.any(String),
        })
      })
    })
  })

  describe('deleteByTaskGroupId', () => {
    it('[正常系]特定のtaskGroupIdのtaskを削除できる', async () => {
      await seedTaskGroup({ id: '1' })
      await seedTaskGroup({ id: '2' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })
      await seedTask({ id: '3', taskGroupId: '2' })

      await taskRepo.deleteByTaskGroupId(new TaskGroupId('1'))
      const tasks = await prisma.task.findMany()
      tasks.map((task) => {
        expect(task).toEqual({
          id: '3',
          taskGroupId: '2',
          name: expect.any(String),
        })
      })
    })
  })
})
