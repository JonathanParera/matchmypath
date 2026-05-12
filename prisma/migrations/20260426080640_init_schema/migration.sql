/*
  Warnings:

  - You are about to alter the column `profitPotential` on the `sidehustle` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - Added the required column `barrierToEntry` to the `SideHustle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `riskWarning` to the `SideHustle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `steps` to the `SideHustle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sustainability` to the `SideHustle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sidehustle` ADD COLUMN `barrierToEntry` DOUBLE NOT NULL,
    ADD COLUMN `riskWarning` TEXT NOT NULL,
    ADD COLUMN `steps` TEXT NOT NULL,
    ADD COLUMN `sustainability` DOUBLE NOT NULL,
    MODIFY `profitPotential` DOUBLE NOT NULL;
