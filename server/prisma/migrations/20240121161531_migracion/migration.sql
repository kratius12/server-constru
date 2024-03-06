/*
  Warnings:

  - You are about to drop the column `contrasena` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cliente` table. All the data in the column will be lost.
  - You are about to drop the column `idCat` on the `compras_detalle` table. All the data in the column will be lost.
  - You are about to drop the column `apellido` on the `empleado` table. All the data in the column will be lost.
  - You are about to drop the column `idProveedor` on the `materiales` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `obras` table. All the data in the column will be lost.
  - You are about to alter the column `area` on the `obras` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Int`.
  - You are about to drop the `empleado_obra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imagenfactura` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materiales_obras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rol_permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `salt` to the `cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idProv` to the `compras` table without a default value. This is not possible if the table is not empty.
  - Made the column `idCompra` on table `compras_detalle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idEmp` on table `empleado_especialidad` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idEsp` on table `empleado_especialidad` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `precio` to the `obras` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `compras_detalle` DROP FOREIGN KEY `compras_detalle_ibfk_1`;

-- DropForeignKey
ALTER TABLE `compras_detalle` DROP FOREIGN KEY `compras_detalle_ibfk_3`;

-- DropForeignKey
ALTER TABLE `empleado_especialidad` DROP FOREIGN KEY `empleado_especialidad_ibfk_1`;

-- DropForeignKey
ALTER TABLE `empleado_especialidad` DROP FOREIGN KEY `empleado_especialidad_ibfk_2`;

-- DropForeignKey
ALTER TABLE `empleado_obra` DROP FOREIGN KEY `empleado_obra_ibfk_1`;

-- DropForeignKey
ALTER TABLE `empleado_obra` DROP FOREIGN KEY `empleado_obra_ibfk_2`;

-- DropForeignKey
ALTER TABLE `materiales` DROP FOREIGN KEY `materiales_ibfk_1`;

-- DropForeignKey
ALTER TABLE `materiales_obras` DROP FOREIGN KEY `materiales_obras_ibfk_3`;

-- DropForeignKey
ALTER TABLE `materiales_obras` DROP FOREIGN KEY `materiales_obras_ibfk_4`;

-- DropForeignKey
ALTER TABLE `rol_permiso` DROP FOREIGN KEY `rol_permiso_ibfk_1`;

-- DropForeignKey
ALTER TABLE `rol_permiso` DROP FOREIGN KEY `rol_permiso_ibfk_2`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `usuario_ibfk_1`;

-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `contrasena`,
    DROP COLUMN `createdAt`,
    ADD COLUMN `constrasena` VARCHAR(200) NULL,
    ADD COLUMN `salt` VARCHAR(200) NOT NULL,
    MODIFY `cedula` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `compras` ADD COLUMN `idProv` INTEGER NOT NULL,
    MODIFY `codigoFactura` VARCHAR(20) NULL;

-- AlterTable
ALTER TABLE `compras_detalle` DROP COLUMN `idCat`,
    MODIFY `idCompra` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `empleado` DROP COLUMN `apellido`,
    ADD COLUMN `apellidos` VARCHAR(50) NULL,
    ADD COLUMN `contrasena` VARCHAR(200) NULL,
    ADD COLUMN `salt` VARCHAR(200) NULL,
    MODIFY `tipoDoc` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `empleado_especialidad` MODIFY `idEmp` INTEGER NOT NULL,
    MODIFY `idEsp` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `materiales` DROP COLUMN `idProveedor`;

-- AlterTable
ALTER TABLE `obras` DROP COLUMN `createdAt`,
    ADD COLUMN `precio` INTEGER NOT NULL,
    MODIFY `area` INTEGER NULL;

-- DropTable
DROP TABLE `empleado_obra`;

-- DropTable
DROP TABLE `imagenfactura`;

-- DropTable
DROP TABLE `materiales_obras`;

-- DropTable
DROP TABLE `rol_permiso`;

-- DropTable
DROP TABLE `usuario`;

-- CreateTable
CREATE TABLE `detalle_obra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `actividad` VARCHAR(60) NULL,
    `fechaini` VARCHAR(50) NULL,
    `fechafin` VARCHAR(50) NULL,
    `idEmp` INTEGER NOT NULL,
    `idMat` INTEGER NOT NULL,
    `estado` VARCHAR(50) NULL,
    `idObra` INTEGER NOT NULL,

    INDEX `idEmp`(`idEmp`),
    INDEX `idMat`(`idMat`),
    INDEX `idObra`(`idObra`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rolpermisoempleado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRol` INTEGER NOT NULL,
    `idPer` INTEGER NOT NULL,
    `idEmp` INTEGER NULL,

    INDEX `idEmp`(`idEmp`),
    INDEX `idPer`(`idPer`),
    INDEX `idRol`(`idRol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idProv` ON `compras`(`idProv`);

-- AddForeignKey
ALTER TABLE `compras` ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`idProv`) REFERENCES `proveedor`(`idProv`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compras_detalle` ADD CONSTRAINT `compras_detalle_ibfk_1` FOREIGN KEY (`idCompra`) REFERENCES `compras`(`idCom`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `empleado_especialidad` ADD CONSTRAINT `empleado_especialidad_ibfk_1` FOREIGN KEY (`idEmp`) REFERENCES `empleado`(`idEmp`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `empleado_especialidad` ADD CONSTRAINT `empleado_especialidad_ibfk_2` FOREIGN KEY (`idEsp`) REFERENCES `especialidad`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `detalle_obra` ADD CONSTRAINT `detalle_obra_ibfk_1` FOREIGN KEY (`idObra`) REFERENCES `obras`(`idObra`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `detalle_obra` ADD CONSTRAINT `detalle_obra_ibfk_2` FOREIGN KEY (`idEmp`) REFERENCES `empleado`(`idEmp`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `detalle_obra` ADD CONSTRAINT `detalle_obra_ibfk_3` FOREIGN KEY (`idMat`) REFERENCES `materiales`(`idMat`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rolpermisoempleado` ADD CONSTRAINT `rolpermisoempleado_ibfk_1` FOREIGN KEY (`idEmp`) REFERENCES `empleado`(`idEmp`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rolpermisoempleado` ADD CONSTRAINT `rolpermisoempleado_ibfk_2` FOREIGN KEY (`idPer`) REFERENCES `permiso`(`idPer`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rolpermisoempleado` ADD CONSTRAINT `rolpermisoempleado_ibfk_3` FOREIGN KEY (`idRol`) REFERENCES `rol`(`idRol`) ON DELETE RESTRICT ON UPDATE RESTRICT;
