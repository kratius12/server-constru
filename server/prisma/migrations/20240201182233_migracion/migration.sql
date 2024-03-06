/*
  Warnings:

  - Added the required column `idEmp` to the `obras` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detalle_obra` MODIFY `idEmp` INTEGER NULL,
    MODIFY `idMat` INTEGER NULL;

-- AlterTable
ALTER TABLE `obras` ADD COLUMN `idEmp` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `FK_idEmp` ON `obras`(`idEmp`);

-- AddForeignKey
ALTER TABLE `obras` ADD CONSTRAINT `FK_idEmp` FOREIGN KEY (`idEmp`) REFERENCES `empleado`(`idEmp`) ON DELETE RESTRICT ON UPDATE RESTRICT;
