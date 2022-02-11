/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `UserStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserStatus.name_unique" ON "UserStatus"("name");
