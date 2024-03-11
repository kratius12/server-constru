import { Router, json } from "express";
import { PrismaClient } from "@prisma/client"
import { ucfirst } from "../plugins.js";

const prisma = new PrismaClient()
const router = Router()

router.get("/categorias", async (req, res) =>{
    try {
        const result = await prisma.categoria.findMany()
        res.status(200).json(result)

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})
router.get("/categoriasAct", async (req, res) =>{
    try {
        const result = await prisma.categoria.findMany({
            where:{
                estado:1
            }
        })
        res.status(200).json(result)

    } catch (error) {
        console.log(json({message: error.message}));
        return res.status(500).json({message: error.message})
    }
})

router.get("/categoria/:id", async (req, res) =>{
    try {
        const result = await prisma.categoria.findFirst({
            where: {
                idcat:parseInt(req.params.id)
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
})

router.post("/categorias", async (req, res) => {
    try {
        const {nombre, estado, medida} = req.body
        const result = await prisma.categoria.create({
            data:{
                nombre: ucfirst(nombre),
                estado:1,
                medida:medida
            }
        })
        res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

router.put("/categoria/:id", async (req, res) => {
    try {
        const {nombre,  medida} = req.body
        const result = await prisma.categoria.update({
            where:{
                idcat:parseInt(req.params.id)
            },
            data:{
                nombre: ucfirst(nombre),
            }
        })

        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})
    }
})

router.delete("/categoria/:id", async (req, res) => {
    try {
        const result = await prisma.categoria.delete({
            where:{
                idcat:parseInt(req.params.id)
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error.message})
    }
})

router.put("/estadoCategoria/:id",async(req,res)=>{
    try{
        const {estado} = req.body
        const categoriaActualizada = await prisma.categoria.update({
            where: { idcat: parseInt(req.params.id) },
            data: { estado: parseInt(estado) },
          });
      
         if(estado==0){
          await prisma.materiales.updateMany({
            where: { idCategoria: parseInt(req.params.id) },
            data: { estado: 0 },
          });
        }
          else{
        return res.status(200).json(categoriaActualizada)
    }


}catch(error){
        console.error(error)
    }
})


export default router