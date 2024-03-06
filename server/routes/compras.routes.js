import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import subirArchivoProducto from "../ProcesarImagenes/SubirImagen.js";
const router = Router();
const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.get("/compras", async (req, res) => {
    try {
        const compras = await prisma.compras.findMany({});
        return res.send(compras);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error interno del servidor' });
    }
});

router.get('/compra/:id', async (req, res) => {
    try {
        const compra = await prisma.compras.findUnique({
            where: {
                idCom: parseInt(req.params.id)
            },
            include: {
                compras_detalle: {
                    include: {
                        materiales: true,

                    }
                },
                proveedor: {
                    select: {
                        nombre: true
                    }
                }
            }
        });

        if (!compra) {
            return res.status(404).send({ message: 'Compra no encontrada' });
        }

        return res.status(200).send(compra);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error interno del servidor' });
    }
});


router.put("/compraFactura", async (req, res) => {
    try {
        const { codigoFactura } = req.body
        const result = await prisma.compras.findMany({
            where: {
                codigoFactura: codigoFactura
            }
        })
        if (result.length > 0) {
            return res.status(200).json(true)
        } else {
            return res.status(200).json(false)
        }
    } catch (error) {
        console.log(json({ message: error.message }));
        return res.status(500).json({ message: error.message })
    }
})



router.post("/compra", subirArchivoProducto, async (req, res) => {
    if (!req.file) {
        return res.json({ message: "Error al cargar la imagen" });
    }

    const { detalles, total_compra, fecha, codigoFactura, idProv } = req.body;

    const nuevaCompra = await prisma.compras.create({
        data: {
            total_compra: parseInt(total_compra),
            imagen: req.file.filename,
            idProv: parseInt(idProv),
            fecha: fecha,
            codigoFactura: codigoFactura,
        },
    });

    for (const detalle of detalles) {
        const { idMat, cantidad, precio } = detalle;

        await prisma.compras_detalle.createMany({
            data: {
                cantidad: parseInt(cantidad),
                idCompra: nuevaCompra.idCom,
                idMat: parseInt(idMat),
                precio: parseInt(precio),
                subtotal: parseInt(precio * cantidad),
            },
        });
        const materi = await prisma.materiales.findFirst({
            where: {
                idMat: parseInt(idMat)
            }
        })
       
        if(materi.cantidad === 0){
            await prisma.materiales.update({
                where:{
                    idMat: parseInt(idMat)
                },data:{
                    estado:1
                }
            })
        }

            await prisma.materiales.update({
                where: { idMat: parseInt(idMat) },
                data: {
                    cantidad: {
                        increment: parseInt(cantidad),
                    },
                },
            });
        
    }

    return res.status(201).send({ message: "Compra creada exitosamente" });
});


export default router;
