/*
  Warnings:

  - You are about to drop the column `idDocumentUrl` on the `doctor_verifications` table. All the data in the column will be lost.
  - You are about to drop the column `medicalLicenseUrl` on the `doctor_verifications` table. All the data in the column will be lost.
  - You are about to drop the column `proofOfAddressUrl` on the `doctor_verifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `doctor_verifications` DROP COLUMN `idDocumentUrl`,
    DROP COLUMN `medicalLicenseUrl`,
    DROP COLUMN `proofOfAddressUrl`;

-- CreateTable
CREATE TABLE `verification_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `verificationId` INTEGER NOT NULL,
    `documentType` ENUM('ID_DOCUMENT', 'MEDICAL_LICENSE', 'PROOF_OF_ADDRESS') NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `verification_documents` ADD CONSTRAINT `verification_documents_verificationId_fkey` FOREIGN KEY (`verificationId`) REFERENCES `doctor_verifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
