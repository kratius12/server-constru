import { Router, json } from "express";
import { PrismaClient } from "@prisma/client"
import { ucfirst } from "../plugins.js";
const prisma = new PrismaClient()
const router = Router()

router.get("/especialidades", async (req, res) => {
    try {
        const result = await prisma.especialidad.findMany()
        res.status(200).json(result)

    } catch (error) {
        console.log(json({ message: error.message }));
        return res.status(500).json({ message: error.message })
    }
})

router.get("/especialidad/:id", async (req, res) => {
    try {
        const result = await prisma.especialidad.findFirst({
            where: {
                id: parseInt(req.params.id)
            }
        })
        console.log(result);
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
})

router.post("/especialidades", async (req, res) => {
    try {
        const { especialidad, estado } = req.body
        const result = await prisma.especialidad.create({
            data: {
                especialidad: ucfirst(especialidad),
                estado: parseInt(estado)
            }
        })
        console.log(result);
        res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.put("/especialidad/:id", async (req, res) => {
    try {
        const { especialidad } = req.body
        const result = await prisma.especialidad.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                especialidad: ucfirst(especialidad),
            }
        })

        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
})

router.delete("/especialidad/:id", async (req, res) => {
    try {
        const result = await prisma.especialidad.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.status(200).json(result)
        console.log(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
})

router.get("/checkEsp/:nombre/:id", async (req, res) =>{
    try {
        if (parseInt(req.params.id) > 0) {
            const result = await prisma.especialidad.findFirst({
                where:{
                    especialidad:{
                        equals: req.params.nombre
                    },
                    id:{
                        not: parseInt(req.params.id)
                    }
                },
                select:{
                especialidad:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'La especialidad ingresada ya existe'})                
            }
            return res.status(200).json({message: result})
        }else{
            const result = await prisma.especialidad.findFirst({
                where:{
                    especialidad:{
                        equals: req.params.nombre
                    }
                },
                select:{
                    especialidad:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'La especialidad ingresada ya existe'})                
            }
            return res.status(200).json({message: result})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });        
    }
})

router.put("/especialidadStatus/:id", async (req, res) => {
    try {
        const { estado } = req.body
        const result = await prisma.especialidad.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                estado: parseInt(estado)
            }
        })
        console.log(estado)
        return res.status(200).json(result)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.put("/validarEspA", async (req, res) => {
    try {
        const { especialidad } = req.body
        console.log(especialidad.especialidad)

        const result = await prisma.rol.findMany({
            where: {
                nombre: especialidad.especialidad
            }
        })
        if(result.length != 0){
            return res.status(200).json(true)
        }else{
            return res.status(200).json(false)
        }
    } catch (error) {
        console.error(error)
    }
})

export default router