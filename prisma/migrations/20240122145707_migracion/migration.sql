/*
  Warnings:

  - You are about to drop the column `salt` on the `empleado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `empleado` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `cliente` ADD COLUMN `createdAt` DATE NOT NULL DEFAULT (curdate());

-- AlterTable
ALTER TABLE `empleado` DROP COLUMN `salt`,
    ADD COLUMN `createdAt` DATE NOT NULL DEFAULT (curdate()),
    MODIFY `contrasena` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `obras` ADD COLUMN `createdAt` DATE NOT NULL DEFAULT (curdate()),
    MODIFY `area` VARCHAR(50) NULL,
    MODIFY `precio` INTEGER NULL;

-- CreateTable
CREATE TABLE `codigos` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NULL,
    `email` VARCHAR(255) NULL,
    `estado` INTEGER NULL,
    `fecha` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `codigos_codigo_key`(`codigo`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `empleado_email_key` ON `empleado`(`email`);
