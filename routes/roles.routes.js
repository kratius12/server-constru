import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { ucfirst } from "../plugins.js";
const prisma = new PrismaClient();
const router = Router();

router.get("/roles", async (req, res) => {
    try {
        const roles = await prisma.rol.findMany({
            include: {
                rolpermisoempleado: {
                    include: {
                        permiso: true,
                    },
                },
            },
        });
        return res.send(roles);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
router.get("/rolesAct", async (req, res) => {
    try {
        const roles = await prisma.rol.findMany({
            where: {
                estado: 1,
            },
        });
        return res.send(roles);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/rol/:id", async (req, res) => {
    try {
        const rol = await prisma.rol.findUnique({
            where: {
                idRol: parseInt(req.params.id),
            },
            include: {
                rolpermisoempleado: {
                    select: {
                        permiso: {
                            select: {
                                permiso: true,
                                idPer: true,
                            },
                        },
                    },
                    where: {
                        idEmp: null,
                    },
                },
            },
        });
        return res.send(rol);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/rol", async (req, res) => {
    try {
        const { nombre, permisos } = req.body;
        const rol = await prisma.rol.create({
            data: {
                nombre: ucfirst(nombre),
                estado: 1,
            },
        });

        for (var i = 0; i < permisos.length; i++) {
            var elemento = permisos[i];
            if (elemento.hasOwnProperty("value")) {
                var value = elemento.value;
                await prisma.rolpermisoempleado.createMany({
                    data: {
                        idPer: parseInt(value),
                        idRol: parseInt(rol.idRol),
                        idEmp: null,
                    },
                });
            } else {
                console.error(
                    'El objeto en permisos no tiene la propiedad "value"'
                );
            }
        }
        return res.status(201).send({ message: "Rol creado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});




router.get("/checkRol/:rol/:id", async (req, res) =>{
    try {
        if (parseInt(req.params.id) > 0) {
            const result = await prisma.rol.findFirst({
                where:{
                    nombre:{
                        equals: req.params.rol
                    },
                    idRol:{
                        not: parseInt(req.params.id)
                     }
                },
                select:{
                nombre:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'El rol ingresado ya existe'})                
            }
            return res.status(200).json({message: result})
        }else{
            const result = await prisma.rol.findFirst({
                where:{
                    nombre:{
                        equals: req.params.rol
                    }
                },
                select:{
                nombre:true
                }
            })       
            if (result) {
                return res.status(203).json({message: 'El rol ingresado ya existe'})                
            }
            return res.status(200).json({message: result})
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });        
    }
})



router.put("/rol/:id", async (req, res) => {
    try {
        const { nombre, permisos } = req.body;


        const rol = await prisma.rol.update({
            data: {
                nombre: ucfirst(nombre),
            },
            where: {
                idRol: parseInt(req.params.id),
            },
        });

        const empleadosPermisos = await prisma.rolpermisoempleado.findMany({
            where: {
                idEmp: {
                    gt: 0
                },
                idRol: parseInt(req.params.id)
            },
            select: {
                idEmp: true
            },
            distinct: ['idEmp']
        })

        const deletePer = await prisma.rolpermisoempleado.deleteMany({
            where: {
                idRol: parseInt(req.params.id)
            },
        });

        await Promise.all(permisos.map(async (item) => {
            try {
                const addPermisosRol = await prisma.rolpermisoempleado.create({
                    data: {
                        idRol: parseInt(req.params.id),
                        idPer: parseInt(item.value)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }))
        if (empleadosPermisos.length > 0) {
            console.log(empleadosPermisos)
            empleadosPermisos.map(async (id) => {
                await Promise.all(permisos.map(async (item) => {
                    try {
                        const addPermisosEmp = await prisma.rolpermisoempleado.create({
                            data: {
                                idEmp: parseInt(id.idEmp),
                                idRol: parseInt(req.params.id),
                                idPer: parseInt(item.value)
                            }
                        });
                    } catch (error) {
                        console.error('Error al agregar permiso para empleado:', id, 'y permiso:', item.idPer, '-', error);
                    }
                }));
            });
        }
        return res
            .status(201)
            .send({ message: "Rol actualizado exitosamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});


router.put("/estadoRol/:id", async (req, res) => {
    try {
        const { estado } = req.body;
        const result = await prisma.rol.update({
            where: {
                idRol: parseInt(req.params.id),
            },
            data: {
                estado: parseInt(estado),
            },
        });

        if (estado === 0) {
            const empIn = await prisma.rolpermisoempleado.findMany({
                where: {
                    idRol: parseInt(req.params.id),
                    idEmp: { not: null },
                },
                select: {
                    idEmp: true,
                    idRol: true,
                },
            });

            const uniqueIdEmps = new Set();

            empIn.forEach((item) => {
                uniqueIdEmps.add(item.idEmp);
            });

            const idEmpsArray = Array.from(uniqueIdEmps);
            const inactivarEmpleado = await prisma.empleado.updateMany({
                where: {
                    idEmp: {
                        in: idEmpsArray,
                    },
                },
                data: {
                    estado: 0,
                },
            });
        }
    } catch (error) {
        console.error(error);
    }
});


router.get("/prueba/:id", async (req, res) => {
    try {
        const idRol = parseInt(req.params.id);

        const empleados = await prisma.rolpermisoempleado.findMany({
            where: {
                AND: [
                    {
                        idRol: idRol,
                    },
                    {
                        NOT: [
                            {
                                idEmp: null,
                            },
                        ],
                    },
                ],
            },
            select: {
                idEmp: true,
            },
        });


        const empleadosUnicos = [...new Set(empleados.map((emp) => emp.idEmp))];

        return res.status(200).json({ empleados: empleadosUnicos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});


router.put("/rolSE/:id", async (req, res) => {
    try {
        const { nombre } = req.body       
            const rol = await prisma.rol.findFirst({
                where: {
                    nombre:nombre,
                    NOT: {
                        idRol: parseInt(req.params.id)
                    }
                }
            })
            console.log(rol)
            if (rol != null) {
                return res.json(true)
            } else if(rol == null) {
                return res.json(false)
            }
       


    } catch (error) {
        console.error(error)
    }
})

router.put("/rolSA", async (req,res)=>{
    try {
        const {nombre} = req.body
        console.log(nombre)
        console.log(req.body)
        const rol = await prisma.rol.findMany({
            where:{
                nombre
            }
        })
        console.log(rol)
        if(rol.length != 0){
            console.log(false)
            return res.json(false)
        }else{
            console.log(true)
            return res.json(true)
        }
    } catch (error) {
        console.error(error)
    }
})


export default router;
