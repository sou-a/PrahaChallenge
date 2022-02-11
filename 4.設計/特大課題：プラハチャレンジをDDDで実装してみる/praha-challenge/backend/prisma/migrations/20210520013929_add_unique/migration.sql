/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TaskUserStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TaskUserStatus.name_unique" ON "TaskUserStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team.name_unique" ON "Team"("name");
