import { Router, json } from "express";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const router = Router()

router.get("/dashboard/clientes", async (req, res) =>{
    try {
        const result = await prisma.cliente.findMany()
        res.status(200).json(result)

    } catch (error) {
        console.log(json({message: error.message}));
        return res.status(500).json({message: error.message})
    }
})

router.get("/dashboard/obras", async (req, res) =>{
    try {
        const result = await prisma.obras.findMany({

        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
})

router.get("/dashboard/clienteObras", async (req, res) =>{
    try {
        const result = await prisma.obras.findMany({
            include:{
                cliente:true
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
})

router.get("/dashboard/especialidades", async (req, res) =>{
    try {
        const result = await prisma.obras.findMany({
            include:{
                actividades_empleados:{
                    where:{
                        idEmp:{
                            gt:0
                        },
                        idMat:{
                            gt:0
                        }
                    },
                    include:{
                        empleado:{
                            include:{
                                empleado_especialidad:{
                                    include:{
                                        especialidad:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
})


router.get("/dashboard/clientesCount", async (req, res) =>{
    try {
        const result = await prisma.cliente.count()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
})

router.get("/dashboard/obrasCount", async (req, res) =>{
    try {
        const result = await prisma.obras.count()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
})

router.get("/dashboard/empleadosCount", async (req, res) =>{
    try {
        const result = await prisma.empleado.count()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
})

export default router