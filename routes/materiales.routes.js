import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { ucfirst } from "../plugins.js";
const prisma = new PrismaClient()

const router = Router()

router.get("/materiales", async (req, res) => {
    try {
        const materiales = await prisma.materiales.findMany({
            select: {
                idMat: true,
                estado: true,
                nombre: true,
                cantidad:true,
                categoria: {
                    select: {
                        nombre: true
                    }
                }

            }

        })
        return res.send(materiales)
    } catch (error) {
        console.error(error)
    }
})
router.get("/materialesAc", async (req, res) => {
    try {
        const materiales = await prisma.materiales.findMany({
            where:{
                estado:1
            }

        })
        return res.send(materiales)
    } catch (error) {
        console.error(error)
    }
})
router.get("/material/:id", async (req, res) => {
    try {
        const material = await prisma.materiales.findFirst({
            where: {
                idMat: parseInt(req.params.id)
            }
        })
        return res.send(material)
    } catch (error) {
        console.error(error)
    }
})

router.post("/materiales", async (req, res) => {
    try {
        const { nombre, idCategoria, cantidad } = req.body
        const result = await prisma.materiales.create({
            data: {
                nombre: ucfirst(nombre),
                estado: 1,
                cantidad:parseInt(cantidad),
                idCategoria:parseInt(idCategoria),
            },
            
        })
    } catch (error) {
        console.error(error)
    }
})

router.put("/material/:id", async (req, res) => {
    try {
        const idMat = req.params.id
        const { nombre, cantidad,  idCategoria } = req.body
        const response = await prisma.materiales.update({
            where: {
                idMat: parseInt(idMat)
            },
            data: {
                nombre: ucfirst(nombre),
                idCategoria: idCategoria
            }
        })
        return res.status(200).json({message: response})
    } catch (error) {
        console.error(error)
    }
})

router.get("/checkMat/:nombre/:id", async (req, res) =>{
    try {
        if (parseInt(req.params.id) > 0) {
            const result = await prisma.materiales.findFirst({
                where:{
                    nombre:{
                        equals: req.params.nombre
                    },
                    idMat:{
                        not: parseInt(req.params.id)
                     }
                },
                select:{
                nombre:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'El material ingresado ya existe'})                
            }
            return res.status(200).json({message: result})
        }else{
            const result = await prisma.materiales.findFirst({
                where:{
                    nombre:{
                        equals: req.params.nombre
                    }
                },
                select:{
                    nombre:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'El material ingresado ya existe'})                
            }
            return res.status(200).json({message: result})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });        
    }
})

router.delete("/material/:id", async (req, res) => {
    try {
        const response = await prisma.materiales.delete({
            where: {
                idMat: req.params.id
            }
        })
    } catch (error) {
        console.error(error)
    }
})

router.put("/materialEstado/:id", async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
  
    const material = await prisma.materiales.findUnique({
        where: {
          idMat: Number(id),
        },
        include: {
          categoria: true,
        },
      });
      if (estado === 1) {
        if (material.categoria.estado == 1) {
          await prisma.materiales.update({
            where: {
              idMat: Number(id),
            },
            data: {
              estado,
            },
          });
      
          return res.status(200).json({
            message: "Estado del material actualizado con éxito",
            type: "green",
          });
        } else if(material.categoria.estado==0){
          return res.status(205).json({
            message: "No se puede editar el estado del material si el estado de la categoría es 0",
            type: "red",
          });
        }
        else if (material.cantidad === 0 ){
            return res.status(204).json({
                message:"El material no se puede editar si la cantidad es igual a 0",
                type:"red"
            })
          }
      }else if(estado===0){
        const newEstado = await prisma.materiales.update({
            where:{
                idMat:parseInt(req.params.id)
            },data:{
                estado: parseInt(estado)
            }
        })
      }
  });

export default router