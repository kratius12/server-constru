import {Router} from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const router = Router()

router.get("/usuarios", async(req,res)=>{
    try{
        const usuarios = await prisma.usuario.findMany({
            select:{
                idUsu:true,
                correo:true,
                estado:true,
                contrasena:true,
                idEmp:true,
                rol:{
                    select:{
                        nombre:true
                    }
                }
            }
        })
        
        return res.send(usuarios)
    }catch(error){
        console.error(error)
    }
})

router.get("/usuario/:id",async(req,res)=>{
    try {
        const usuario = await prisma.usuario.findFirst({
            where: {
                idUsu: parseInt(req.params.id)
            },
            include:{
                rol:{
                    select:{
                        nombre:true
                    }
                }
            }
        })
        console.log(usuario)
        return res.send(usuario)
    } catch (error) {
        console.error(error)
    }
})

router.post("/usuario",async(req,res)=>{
    try{
        const {correo,constrasena,estado,idRol,idEmp} = req.body
        const result = await prisma.usuario.create({
            data:{
                correo:correo,
                contrasena:constrasena,
                estado:parseInt(estado),
                idRol:parseInt(idRol),
                idEmp:parseInt(idEmp)
            }
        })
        console.log(result)
    }catch(error){
        console.error(error)
    }
})

router.put("/usuario/:id",async(req,res)=>{
    try{
        const {correo,constrasena,estado,idRol,idEmp} = req.body
        const result = await prisma.usuario.update({
            where:{
                idUsu: parseInt(req.params.id)
            },
            data:{
                correo:correo,
                contrasena:constrasena,
                estado:parseInt(estado),
                idRol:parseInt(idRol),
                idEmp:parseInt(idEmp)
            }
        })
    }catch(error){
        console.error(error)
    }
})

router.put("/estadoUsuario/:id",async(req,res)=>{
    try{
        const {estado} = req.body
        const result = await prisma.usuario.update({
            where:{
                idUsu:parseInt(req.params.id)
            },data:{
                estado:parseInt(estado)
            }
        })
    }catch(error){
        console.error(error)
    }
})

export default router