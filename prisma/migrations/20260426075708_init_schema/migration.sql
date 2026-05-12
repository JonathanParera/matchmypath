-- CreateTable
CREATE TABLE `SideHustle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `minCapital` DOUBLE NOT NULL,
    `timePerDay` INTEGER NOT NULL,
    `vibe` VARCHAR(191) NOT NULL,
    `toolRequired` VARCHAR(191) NOT NULL,
    `profitPotential` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
