/*
  Warnings:

  - You are about to drop the column `isVerified` on the `doctor_profiles` table. All the data in the column will be lost.
  - Added the required column `placeOfPractice` to the `doctor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsOfPractice` to the `doctor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Made the column `phoneNumber` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `doctor_profiles` DROP COLUMN `isVerified`,
    ADD COLUMN `placeOfPractice` VARCHAR(191) NOT NULL,
    ADD COLUMN `verificationStatus` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `yearsOfPractice` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `patients` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL,
    ADD COLUMN `nationality` VARCHAR(191) NOT NULL,
    ADD COLUMN `occupation` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `phoneNumber` VARCHAR(191) NOT NULL;
