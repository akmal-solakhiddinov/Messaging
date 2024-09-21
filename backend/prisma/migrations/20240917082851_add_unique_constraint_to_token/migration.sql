/*
  Warnings:

  - A unique constraint covering the columns `[userId,token]` on the table `Token` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Token` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Token` ADD COLUMN `id` VARCHAR(191) NOT NULL,
    MODIFY `token` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Token_userId_token_key` ON `Token`(`userId`, `token`);
