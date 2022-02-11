import { prisma } from '@testUtil/prisma'

describe('prism全般に関するテスト', () => {
  beforeAll(async () => {
    await prisma.userStatus.deleteMany()
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })
  describe('基本的なcrud機能', () => {
    afterEach(async () => {
      await prisma.userStatus.deleteMany()
    })
    it('DBに追加できる', async () => {
      await prisma.userStatus.create({
        data: {
          id: '1',
          name: 'name',
        },
      })
      const alluserStatus = await prisma.userStatus.findMany()
      expect(alluserStatus).toHaveLength(1)
    })
  })
  describe('トランザクション', () => {
    it('トランザクション処理中に問題が発生したらロールバックされる', async () => {
      try {
        const task1 = prisma.userStatus.create({
          data: {
            id: '1',
            name: 'name',
          },
        })
        const task2 = prisma.userStatus.create({
          data: {
            id: '1', // idの重複によりエラーが発生する
            name: 'name',
          },
        })
        await prisma.$transaction([task1, task2])
      } catch (error) {
        const alluserStatus = await prisma.userStatus.findMany()
        expect(alluserStatus).toHaveLength(0)
      }
    })
  })
})
