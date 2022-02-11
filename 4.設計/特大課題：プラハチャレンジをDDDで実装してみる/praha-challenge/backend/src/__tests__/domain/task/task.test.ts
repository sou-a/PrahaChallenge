import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { Task } from 'src/domain/task/task'
import { TaskId } from 'src/domain/task/task-id'
import { createRandomIdString } from 'src/util/random'

describe('task.ts', () => {
  describe('constructor', () => {
    it('[正常系]生成できる', () => {
      expect(
        new Task({
          id: new TaskId(createRandomIdString()),
          name: 'タスク',
          taskGroupId: new TaskGroupId(createRandomIdString()),
        }),
      ).toEqual(expect.any(Task))
    })
  })
  describe('changeTaskGroupId', () => {
    it('[正常系]タスクグループIdを変更できる', () => {
      const task = new Task({
        id: new TaskId(createRandomIdString()),
        name: 'タスク',
        taskGroupId: new TaskGroupId(createRandomIdString()),
      })
      task.changeTaskGroupId(new TaskGroupId('1'))
      expect(task.getAllProperties().taskGroupId).toEqual(new TaskGroupId('1'))
    })
  })
})
