-- CreateTable
CREATE TABLE `doctor_verifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `doctorId` INTEGER NOT NULL,
    `bvn` VARCHAR(191) NULL,
    `medicalLicenseNumber` VARCHAR(191) NULL,
    `homeAddress` VARCHAR(191) NOT NULL,
    `idDocumentUrl` VARCHAR(191) NULL,
    `medicalLicenseUrl` VARCHAR(191) NULL,
    `proofOfAddressUrl` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `adminRemark` VARCHAR(191) NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `doctor_verifications_doctorId_key`(`doctorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `doctor_verifications` ADD CONSTRAINT `doctor_verifications_doctorId_fkey` FOREIGN KEY (`doctorId`) REFERENCES `doctor_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
