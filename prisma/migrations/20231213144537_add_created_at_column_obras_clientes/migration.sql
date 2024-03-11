-- CreateTable
CREATE TABLE `categoria` (
    `idcat` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NULL,
    `estado` INTEGER NULL,
    `medida` VARCHAR(50) NULL,

    PRIMARY KEY (`idcat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cliente` (
    `idCli` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(70) NULL,
    `apellidos` VARCHAR(50) NULL,
    `email` VARCHAR(100) NULL,
    `direccion` VARCHAR(50) NULL,
    `telefono` VARCHAR(10) NULL,
    `tipoDoc` VARCHAR(50) NULL,
    `cedula` VARCHAR(10) NOT NULL,
    `fecha_nac` VARCHAR(50) NULL,
    `estado` INTEGER NULL,
    `contrasena` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idCli`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compras` (
    `idCom` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` VARCHAR(50) NULL,
    `imagen` VARCHAR(100) NULL,
    `total_compra` INTEGER NULL,
    `codigoFactura` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`idCom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compras_detalle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCompra` INTEGER NULL,
    `idCat` INTEGER NOT NULL,
    `idMat` INTEGER NULL,
    `cantidad` INTEGER NULL,
    `precio` INTEGER NULL,
    `subtotal` INTEGER NULL,

    INDEX `idCompra`(`idCompra`),
    INDEX `idMat`(`idMat`),
    INDEX `idCat`(`idCat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleado` (
    `idEmp` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NULL,
    `apellido` VARCHAR(50) NOT NULL,
    `direccion` VARCHAR(50) NULL,
    `estado` INTEGER NULL,
    `email` VARCHAR(100) NULL,
    `telefono` VARCHAR(10) NULL,
    `cedula` VARCHAR(10) NULL,
    `tipoDoc` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`idEmp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleado_especialidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEmp` INTEGER NULL,
    `idEsp` INTEGER NULL,

    INDEX `idEmp`(`idEmp`),
    INDEX `idEsp`(`idEsp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleado_obra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEmp` INTEGER NULL,
    `idObra` INTEGER NULL,

    INDEX `idEmp`(`idEmp`),
    INDEX `idObra`(`idObra`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `especialidad` VARCHAR(30) NULL,
    `estado` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiales` (
    `idMat` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NULL,
    `idProveedor` INTEGER NULL,
    `estado` INTEGER NULL,
    `idCategoria` INTEGER NULL,

    INDEX `idCategoria`(`idCategoria`),
    INDEX `idProveedor`(`idProveedor`),
    PRIMARY KEY (`idMat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiales_obras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idMaterial` INTEGER NULL,
    `idObra` INTEGER NULL,
    `consumo` VARCHAR(20) NULL,

    INDEX `idMaterial`(`idMaterial`),
    INDEX `idObra`(`idObra`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `obras` (
    `idObra` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(100) NULL,
    `fechaini` VARCHAR(50) NULL,
    `fechafin` VARCHAR(50) NULL,
    `area` VARCHAR(50) NULL,
    `idCliente` INTEGER NULL,
    `estado` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idCliente`(`idCliente`),
    PRIMARY KEY (`idObra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permiso` (
    `idPer` INTEGER NOT NULL AUTO_INCREMENT,
    `permiso` VARCHAR(30) NULL,
    `estado` INTEGER NULL,

    PRIMARY KEY (`idPer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proveedor` (
    `idProv` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NULL,
    `direccion` VARCHAR(100) NULL,
    `nit` VARCHAR(14) NULL,
    `tipo` VARCHAR(10) NULL,
    `estado` INTEGER NULL,
    `email` VARCHAR(100) NULL,
    `telefono` VARCHAR(15) NULL,
    `nombreContacto` VARCHAR(50) NULL,
    `telefonoContacto` VARCHAR(10) NULL,
    `emailContacto` VARCHAR(100) NULL,

    PRIMARY KEY (`idProv`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `idRol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(30) NULL,
    `estado` INTEGER NULL,

    PRIMARY KEY (`idRol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol_permiso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRol` INTEGER NULL,
    `idPer` INTEGER NULL,
    `tipo` VARCHAR(100) NOT NULL,

    INDEX `idPer`(`idPer`),
    INDEX `idRol`(`idRol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `idUsu` INTEGER NOT NULL AUTO_INCREMENT,
    `correo` VARCHAR(100) NOT NULL,
    `estado` INTEGER NOT NULL,
    `contrasena` VARCHAR(20) NULL,
    `idRol` INTEGER NULL,
    `idEmp` INTEGER NOT NULL,

    INDEX `idRol`(`idRol`),
    INDEX `idEmp`(`idEmp`),
    PRIMARY KEY (`idUsu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imagenfactura` (
    `idImg` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(200) NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `data` LONGBLOB NOT NULL,

    PRIMARY KEY (`idImg`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `compras_detalle` ADD CONSTRAINT `compras_detalle_ibfk_1` FOREIGN KEY (`idCompra`) REFERENCES `compras`(`idCom`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compras_detalle` ADD CONSTRAINT `compras_detalle_ibfk_2` FOREIGN KEY (`idMat`) REFERENCES `materiales`(`idMat`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `compras_detalle` ADD CONSTRAINT `compras_detalle_ibfk_3` FOREIGN KEY (`idCat`) REFERENCES `categoria`(`idcat`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `empleado_especialidad` ADD CONSTRAINT `empleado_especialidad_ibfk_1` FOREIGN KEY (`idEmp`) REFERENCES `empleado`(`idEmp`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `empleado_especialidad` ADD CONSTRAINT `empleado_especialidad_ibfk_2` FOREIGN KEY (`idEsp`) REFERENCES `especialidad`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `empleado_obra` ADD CONSTRAINT `empleado_obra_ibfk_1` FOREIGN KEY (`idEmp`) REFERENCES `empleado`(`idEmp`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `empleado_obra` ADD CONSTRAINT `empleado_obra_ibfk_2` FOREIGN KEY (`idObra`) REFERENCES `obras`(`idObra`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `materiales` ADD CONSTRAINT `materiales_ibfk_1` FOREIGN KEY (`idProveedor`) REFERENCES `proveedor`(`idProv`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `materiales` ADD CONSTRAINT `materiales_ibfk_2` FOREIGN KEY (`idCategoria`) REFERENCES `categoria`(`idcat`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `materiales_obras` ADD CONSTRAINT `materiales_obras_ibfk_3` FOREIGN KEY (`idMaterial`) REFERENCES `materiales`(`idMat`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `materiales_obras` ADD CONSTRAINT `materiales_obras_ibfk_4` FOREIGN KEY (`idObra`) REFERENCES `obras`(`idObra`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `obras` ADD CONSTRAINT `obras_ibfk_3` FOREIGN KEY (`idCliente`) REFERENCES `cliente`(`idCli`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rol_permiso` ADD CONSTRAINT `rol_permiso_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol`(`idRol`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `rol_permiso` ADD CONSTRAINT `rol_permiso_ibfk_2` FOREIGN KEY (`idPer`) REFERENCES `permiso`(`idPer`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `rol`(`idRol`) ON DELETE RESTRICT ON UPDATE RESTRICT;
