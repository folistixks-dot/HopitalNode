/*
  Warnings:

  - You are about to drop the column `gender` on the `patients` table. All the data in the column will be lost.
  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `patients` DROP COLUMN `gender`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `gender` VARCHAR(191) NOT NULL;
