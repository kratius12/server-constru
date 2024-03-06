import { Router, json } from "express";
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import { ucfirst } from "../plugins.js";
const prisma = new PrismaClient()
const router = Router()

router.get("/empleados", async (req, res) => {
    try {
        const result = await prisma.empleado.findMany({
            include: {
                rolpermisoempleado: {
                    distinct: ["idRol"],
                    select: {
                        rol: {
                            select: {
                                idRol: true,
                                nombre: true
                            }
                        }
                    },
                }
            }
        })
        res.status(200).json(result)

    } catch (error) {
        console.log(json({ message: error.message }));
        return res.status(500).json({ message: error.message })
    }
})

router.get("/empleado/:id", async (req, res) => {
    try {
        const result = await prisma.empleado.findFirst({
            where: {
                idEmp: parseInt(req.params.id)
            },
            include: {
                empleado_especialidad: {
                    select: {
                        id: true,
                        especialidad: true
                    }
                },

            }
        })
        const rol = await prisma.rolpermisoempleado.findFirst({
            where:{
                idEmp:parseInt(req.params.id)
            },select:{
                idRol:true,
                rol:{
                    select:{
                        nombre:true
                    }
                }
            }
        })
        const enviar = {
            ...result,
           rol: {idRol: rol.idRol, nombre: rol.rol.nombre}
        } 
        res.status(200).json(enviar);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
})
router.get("/empleadosAct", async (req, res) => {
    try {
        const result = await prisma.empleado.findMany({
            where: {
                estado: 1
            },
        })
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
})

const generarHash = async (password, saltRounds = 10) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
};

router.post("/empleados", async (req, res) => {
    try {
        const { nombre, apellidos, direccion, estado, telefono, tipoDoc, cedula, especialidad, email, contrasena, rol } = req.body;
        const { hash, salt } = await generarHash(contrasena);
        const result = await prisma.empleado.create({
            data: {
                nombre: ucfirst(nombre),

                apellidos: ucfirst(apellidos),
                direccion: ucfirst(direccion),
                telefono: telefono,
                tipoDoc: tipoDoc,
                cedula: cedula,
                estado: parseInt(estado),
                email: email,
                contrasena: hash, // Almacenar el hash en lugar de la contraseña original
            },
        });

        // Almacenar las especialidades

        await Promise.all(especialidad.map(async (idEsp) => {
            await prisma.empleado_especialidad.create({
                data: {
                    idEmp: parseInt(result.idEmp),
                    idEsp: parseInt(idEsp.value)
                }
            });
        }));
        const role = await prisma.rolpermisoempleado.findMany({
            where: {
                idRol: parseInt(rol),
                idEmp: null
            }
        })
        for (const rols of role) {
            const nuevo = await prisma.rolpermisoempleado.create({
                data: {
                    idEmp: result.idEmp,
                    idPer: rols.idPer,
                    idRol: rols.idRol
                }
            })
        }
        res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put("/empleado/:id", async (req, res) => {
    try {
        const { nombre, apellidos, direccion, estado, telefono, tipoDoc, cedula, especialidad, email, contrasena, rol } = req.body
        const { hash, salt } = await generarHash(contrasena);
        const result = await prisma.empleado.update({
            where: {
                idEmp: parseInt(req.params.id)
            },
            data: {
                nombre: ucfirst(nombre),
                apellidos: ucfirst(apellidos),
                direccion: ucfirst(direccion),
                telefono: telefono,
                tipoDoc: tipoDoc,
                cedula: cedula,
                estado: parseInt(estado),
                email: email,
                contrasena: hash,
            }
        })
        if (especialidad.length > 0) {
            const result2 = await prisma.empleado_especialidad.deleteMany({
                where: {
                    idEmp: parseInt(req.params.id)
                }
            })
            await Promise.all(especialidad.map(async (idEsp) => {
                await prisma.empleado_especialidad.create({
                    data: {
                        idEmp: parseInt(req.params.id),
                        idEsp: parseInt(idEsp.value)
                    }
                })
            }))
        }
        const getRolPermisos = await prisma.rolpermisoempleado.findMany({
            where:{
                AND: [
                    {idRol: parseInt(rol)},
                    {idEmp: null}
                ]
            }
        })
        const cleanEmpRolPermisos = await prisma.rolpermisoempleado.deleteMany({
            where:{
                idEmp:parseInt(req.params.id)
            }
        })
        await Promise.all(getRolPermisos.map(async (item) => {
            try {
                const addPermisosEmp = await prisma.rolpermisoempleado.create({
                    data:{
                        idRol:parseInt(rol),
                        idPer:item.idPer,
                        idEmp:parseInt(req.params.id)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }))
        res.status(200).json({message:'Empleado editado!'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
})
router.delete("/empleado/:id", async (req, res) => {
    try {
        const result = await prisma.empleado.delete({
            where: {
                idEmp: parseInt(req.params.id)
            }
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
})

router.get("/empleadosEsp", async (req, res) => {
    try {
        const result = await prisma.empleado.findMany({

            select: {
                idEmp: true,
                nombre: true,
                telefono: true,
                cedula: true,
                tipoDoc:true,
                estado: true,
                empleado_especialidad: {
                    select: {
                        especialidad: true,
                        idEsp: true
                    }
                }
            }
        })
        return res.status(200).json(result)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.put("/empleadoStatus/:id", async (req, res) => {
    try {
        const { status } = req.body

        const searchRol = await prisma.rolpermisoempleado.findFirst({
            where: {
                idEmp: parseInt(req.params.id)
            }, select: {
                rol: {
                    select: {
                        idRol: true
                    }
                }
            }
        })
        if (status === 1) {
            const validarRol = await prisma.rol.findUnique({
                where: {
                    idRol: searchRol.rol.idRol
                }
            })
            if (validarRol.estado == 1) {
                const actualizarEstado = await prisma.empleado.update({
                    where: {
                        idEmp: parseInt(req.params.id)
                    }, data: {
                        estado: parseInt(status)
                    }
                })
                return res.status(200).json({ message: "Cambio de estado exitoso!!" })
            } else if (validarRol.estado == 0) {
                return res.status(204).json({ message: "No se puede cambiar el estado del empleado puesto que el rol asociado está inactivo" })
            }
        } else if (status === 0) {
            const actualizarEstado = await prisma.empleado.update({
                where: {
                    idEmp: parseInt(req.params.id)
                }, data: {
                    estado: parseInt(status)
                }
            })
            return res.status(200).json({ message: "Cambio de estado exitoso!!" })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.put("/empleados/searchDoc", async (req, res) => {
    try {
        const { cedula, tipoDoc } = req.body

        const result = await prisma.empleado.findMany({
            where: {
                AND: [
                    {
                        cedula: cedula
                    }, {
                        tipoDoc: tipoDoc
                    }
                ]
            }
        })
        if (req.params.id) {
            const result = await prisma.empleado.findMany({
                where: {
                    AND: [
                        {
                            cedula: cedula
                        }, {
                            tipoDoc: tipoDoc
                        },
                        {
                            NOT: {
                                idEmp: parseInt(req.params.id)
                            }
                        }
                    ]
                }
            })
            if (result.length > 0) {
                return res.status(200).json(true)
            } else {
                return res.status(200).json(false)
            }
        }


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

router.put("/empleados/searchDocid/:id", async (req, res) => {
    try {
        const { cedula, tipoDoc } = req.body

        const result = await prisma.empleado.findMany({
            where: {
                AND: [
                    {
                        cedula: cedula
                    }, {
                        tipoDoc: tipoDoc
                    }
                ]
            }
        })
        if (req.params.id) {
            const result = await prisma.empleado.findMany({
                where: {
                    AND: [
                        {
                            cedula: cedula
                        }, {
                            tipoDoc: tipoDoc
                        },
                        {
                            NOT: {
                                idEmp: parseInt(req.params.id)
                            }
                        }
                    ]
                }
            })
            if (result.length > 0) {
                return res.status(200).json(true)
            } else {
                return res.status(200).json(false)
            }
        }


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

router.put("/empleados/searchEmail", async (req, res) => {
    try {
        const { email } = req.body
        const result = await prisma.empleado.findMany({
            where: {
                email: email
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
router.put("empleados/searchEmail/:id",async(req,res)=>{
    try {
        const {email} = req.body
        const emailS = await prisma.empleado.findMany({
            where:{
                email:email,
                NOT:{
                    idEmp:parseInt(req.params.id)
                }
            }
        })
        if(emailS.length>0){
            return res.status(200).json(true)
        }else{
            return res.status(200).json(false)
        }
    } catch (error) {
        
    }
})

router.get("/rolesEmpleado/:id", async (req, res) => {
    try {
        const rol = await prisma.rolpermisoempleado.findFirst({
            where: {
                idEmp: parseInt(req.params.id)
            },
            select: {
                rol: {
                    select: {
                        idRol: true,
                        nombre: true
                    }
                }
            }
        })
        return res.status(200).json(rol)
    } catch (error) {

    }
})

router.get("/checkDocEmp/:cedula/:tipoDoc/:id", async (req, res) => {
    try {
        if (parseInt(req.params.id) > 0) {
            const result = await prisma.empleado.findFirst({
                where:{
                    cedula:{
                        equals:req.params.cedula
                    },
                    tipoDoc:{
                        equals: req.params.tipoDoc
                    },
                    idEmp:{
                        not: parseInt(req.params.id)
                     }
                //  AND:{
                //   cedula:req.params.cedula,
                //   tipoDoc:req.params.tipoDoc
                //  },
                //  NOT:{
    
                //  }
                },
                select:{
                 cedula:true,
                 tipoDoc:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'El documento ingresado ya existe'})                
            }
            return res.status(200).json({message: result})            
        } else {
            const result = await prisma.empleado.findFirst({
                where:{
                 AND:{
                  cedula:req.params.cedula,
                  tipoDoc:req.params.tipoDoc
                 }
                },
                select:{
                 cedula:true,
                 tipoDoc:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'El documento ingresado ya existe'})                
            }
            return res.status(200).json({message: result})            
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}) 
router.get("/checkEmailEmp/:email/:id", async (req, res) => {
    try {
        if (parseInt(req.params.id) > 0) {
            const result = await prisma.empleado.findFirst({
                where:{
                 email:{
                    equals: req.params.email
                 },
                 idEmp:{
                    not: parseInt(req.params.id)
                 }
                },
                select:{
                 email:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'El Correo ingresado ya existe'})                
            }
            return res.status(200).json({message: result})            
        }else{
            const result = await prisma.empleado.findFirst({
                where:{
                 email:req.params.email
                },
                select:{
                 email:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'El Correo ingresado ya existe'})                
            }
            return res.status(200).json({message: result})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

export default router