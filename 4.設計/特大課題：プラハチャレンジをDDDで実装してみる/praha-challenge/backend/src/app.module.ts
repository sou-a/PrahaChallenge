import { Module } from '@nestjs/common'
import { PairController } from './controller/pair-controller'
import { TaskController } from './controller/task-controller'
import { TaskGroupController } from './controller/task-group-contorller'
import { TeamController } from './controller/team-controller'
import { UserController } from './controller/user-controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [
    UserController,
    PairController,
    TeamController,
    TaskController,
    TaskGroupController,
  ],
  providers: [],
})
export class AppModule {}
