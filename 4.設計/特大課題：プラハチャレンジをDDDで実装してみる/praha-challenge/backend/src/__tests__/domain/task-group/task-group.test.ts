import { TaskGroup } from 'src/domain/task-group/task-group'
import { TaskGroupId } from 'src/domain/task-group/task-group-id'
import { TaskId } from 'src/domain/task/task-id'
import { createRandomIdString } from 'src/util/random'

describe('task-group.ts', () => {
  describe('constructor', () => {
    it('[正常系]生成できる', () => {
      expect(
        new TaskGroup({
          id: new TaskGroupId(createRandomIdString()),
          name: 'タスク',
          tasks: [new TaskId('1'), new TaskId('2')],
        }),
      ).toEqual(expect.any(TaskGroup))
    })
  })
  describe('changeName', () => {
    it('[正常系]名前を変更できる', () => {
      const taskGroup = new TaskGroup({
        id: new TaskGroupId(createRandomIdString()),
        name: 'タスクグループ',
        tasks: [new TaskId('1'), new TaskId('2')],
      })
      taskGroup.changeName('変更後のタスクグループ')
      expect(taskGroup.getAllProperties().name).toEqual(
        '変更後のタスクグループ',
      )
    })
  })
})
