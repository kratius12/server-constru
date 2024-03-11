import { Router, json } from "express";
import { format, addDays, max } from 'date-fns';
import { PrismaClient } from "@prisma/client";
import { ucfirst } from "../plugins.js";


const prisma = new PrismaClient()
const router = Router()

router.get("/obras", async (req, res) => {
  try {
    const result = await prisma.obras.findMany({
      select: {
        cliente: true,
        detalle_obra: true,
        actividades_empleados: true,
        actividades_materiales: true,
        area: true,
        descripcion: true,
        fechaini: true,
        empleado: true,
        fechafin: true,
        idCliente: true,
        estado: true,
        precio: true,
        idEmp: true,
        idObra: true
      },
    });

    // Formatear la fecha en cada objeto del resultado
    const obrasFormateadas = result.map((obra) => {
      return {
        ...obra,
        fechaini: format(new Date(obra.fechaini), 'dd/MM/yyyy') // Ajusta el locale según tus preferencias
      };
    });

    res.status(200).json(obrasFormateadas);
  } catch (error) {
    console.error(json({ message: error.message }));
    return res.status(500).json({ message: error.message });
  }
});

router.get("/obra/:id", async (req, res) => {
  try {
    const result = await prisma.obras.findFirst({
      where: {
        idObra: parseInt(req.params.id)
      },
      include: {
        cliente: {
          select: {
            idCli: true,
            nombre: true,
            apellidos: true
          }
        }
      }
    })
    const actividad = await prisma.detalle_obra.groupBy({
      by: ["actividad", "fechafin", "fechafin", "estado", "idObra"],
    });
    const emps = await prisma.actividades_empleados.findMany({
      where: {
        idObra: parseInt(req.params.id)
      }
    })

    const mats = await prisma.actividades_materiales.findMany({
      where: {
        idObra: parseInt(req.params.id)
      }
    })
    const empleadosUnicos = [...new Set(emps.map((emp) => emp.idEmp))];
    const materialesUnicos = [...new Set(mats.map((mat) => mat.idMat))];
    const actividadesConEmpleadosMaterialesUnicos = actividad.map((act) => ({
      ...act,
      empleados: empleadosUnicos.map((idEmp) => emps.find((emp) => emp.idEmp === idEmp).empleado),
      materiales: materialesUnicos.map((idMat) => mats.find((mat) => mat.idMat === idMat).materiales),
    }));

    const response = {
      ...result,
      actividadesConEmpleadosMaterialesUnicos
    }
    res.status(200).json(response)
  } catch (error) {
    console.log(json({ message: error.message }))
    return res.status(500).json({ message: error.message })
  }
})

router.post("/obras", async (req, res) => {
  try {
    const { descripcion, fechaini, idCliente, idEmp } = req.body;
    const obra = await prisma.obras.create({
      data: {
        descripcion: ucfirst(descripcion),
        fechaini: fechaini,
        estado: "Pendiente",
        idCliente: parseInt(idCliente),
        idEmp: parseInt(idEmp)
      },
    });
    res.status(200).json(obra);
  } catch (error) {
    console.log("message:" + error.message);
    return res.status(500).json({ message: error.message });
  }
});


router.put("/obra/:id", async (req, res) => {
  try {
    const { descripcion, area, idCliente, estado, fechafin, fechaini, precio } = req.body;
    const result = await prisma.obras.update({
      where: {
        idObra: parseInt(req.params.id)
      },
      data: {
        descripcion: ucfirst(descripcion),
        area: area,
        estado: estado,
        fechaini: fechaini,
        fechafin: fechafin,
        idCliente: parseInt(idCliente),
        precio: parseInt(precio),

      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/actividades/:id", async (req, res) => {
  const idObra = parseInt(req.params.id);

  try {
    const detallesObra = await prisma.detalle_obra.findMany({
      where: {
        idObra: idObra,
      },
    });

    const actividadesEmpleados = await prisma.actividades_empleados.findMany({
      where: {
        idObra: idObra,
      }, select: {
        actividad: true,
        empleado: {
          select: {
            nombre: true,
            idEmp: true
          }
        }
      }
    });

    const actividadesMateriales = await prisma.actividades_materiales.findMany({
      where: {
        idObra: idObra,
      }, select: {
        actividad: true,
        cantidad: true,
        materiales: {
          select: {
            nombre: true,
            idMat: true,
            // cantidad:true
          }
        }
      }
    });

    // Combinar los resultados antes de enviar la respuesta
    const detallesAgrupados = detallesObra.map((detalle) => {
      const matchingActividadesEmpleados = actividadesEmpleados.filter(
        (actEmpleado) => actEmpleado.actividad === detalle.actividad
      );

      const matchingActividadesMateriales = actividadesMateriales.filter(
        (actMaterial) => actMaterial.actividad === detalle.actividad
      );

      return {
        detalleObra: detalle,
        empleados: matchingActividadesEmpleados,
        materiales: matchingActividadesMateriales,
      };
    });

    res.json(detallesAgrupados);
  } catch (error) {
    console.error('Error al obtener detalles agrupados de obra:', error);
    res.status(500).send('Error interno del servidor');
  }
});



router.post("/guardarActividad/:id", async (req, res) => {
  try {
    const { actividad, fechaini, fechafin, estado, antiguo, empleados, materiales } = req.body;
    for (const material of materiales) {
      const idMaterial = parseInt(material.material.value);
      const cantidadUtilizada = parseInt(material.cantidad);

      // Obtener información del material desde la base de datos
      const materialDB = await prisma.materiales.findFirst({
        where: {
          idMat: parseInt(material.material.value),
        },
      });
      // Restar la cantidad utilizada al material
      const nuevaCantidad = materialDB.cantidad - cantidadUtilizada;

      // Actualizar la cantidad en la base de datos
      await prisma.materiales.update({
        where: {
          idMat: idMaterial,
        },
        data: {
          cantidad: nuevaCantidad,
        },
      });
      if (nuevaCantidad == 0) {
        await prisma.materiales.update({
          where: {
            idMat: idMaterial
          },
          data: {
            estado: 0
          }
        })
      }
    }
    if (antiguo) {
      // Delete the old activity
      await prisma.detalle_obra.deleteMany({
        where: {
          AND: [
            {
              actividad: {
                equals: antiguo
              }
            }, {
              idObra: parseInt(req.params.id)
            }
          ]
        }
      });
      await prisma.actividades_materiales.deleteMany({
        where: {
          AND: [
            {
              actividad: {
                equals: antiguo
              }
            }, {
              idObra: parseInt(req.params.id)
            }
          ]
        }
      })
      await prisma.actividades_empleados.deleteMany({
        where: {
          AND: [
            {
              actividad: {
                equals: antiguo
              }
            }, {
              idObra: parseInt(req.params.id)
            }
          ]
        }
      })
    }

    // Create the new activity
    const result = await prisma.detalle_obra.create({
      data: {
        actividad: ucfirst(actividad),
        fechaini: fechaini,
        fechafin: parseInt(fechafin),
        estado: estado,
        idObra: parseInt(req.params.id)
      }
    });

    for (const material of materiales) {
      await prisma.actividades_materiales.createMany({
        data: {
          actividad: ucfirst(actividad),
          cantidad: parseInt(material.cantidad),
          idMat: parseInt(material.material.value),
          idObra: parseInt(req.params.id)
        }
      })
    }
    for (const empleado of empleados) {
      const meps = await prisma.actividades_empleados.createMany({
        data: {
          actividad: ucfirst(actividad),
          idEmp: parseInt(empleado.value),
          idObra: parseInt(req.params.id)
        }
      })
    }

    res.status(200).json(result);
  } catch (error) {
    console.log("message:" + error.message);
  }
});


router.get("/actividadA/:id", async (req, res) => {
  try {
    const { actividad } = req.body
    const agrup = await prisma.detalle_obra.findMany({
      where: {
        AND: [{
          idObra: parseInt(req.params.id)
        }, {
          actividad: { startsWith: actividad }
        }
        ]
      },
    })



    return res.status(200).json(agrup)
  } catch (error) {
    console.log(error)
  }
})

router.get("/searchActividad/:id", async (req, res) => {
  try {
    const { actividad } = req.body
    const buscar = await prisma.detalle_obra.findMany({
      where: {
        AND: [{
          actividad: {
            contains: actividad
          },
        }, {
          idObra: parseInt(req.params.id)
        }

        ]
      },
    })
    if (buscar.length > 0) {
      return res.status(200).json(true)
    } else {
      return res.status(200).json(false)
    }
    // return res.json(buscar)

  } catch (error) {

  }
})

router.get("/obrasCli/:id", async (req, res) => {
  try {
    const obras = await prisma.obras.findMany({
      where: {
        idCliente: parseInt(req.params.id),
      },
      include: {
        empleado: true,
      },
    });

    const obrasAct = await prisma.actividades_empleados.findMany({
      where: {
        idEmp: parseInt(req.params.id),
      },
      include: {
        obras: true,
      },
    });
    console.log(obras);
    // Utilizamos un Set para almacenar las obras únicas
    const obrasUnicas = new Set();

    obras.forEach((obra) => {
      obrasUnicas.add(JSON.stringify(obra));
    });
    const obrasUnicasArray = Array.from(obrasUnicas).map((obraString) =>
      JSON.parse(obraString)
    );

    const info = {
      obras: obrasUnicasArray,
    };

    return res.status(200).json(info);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
})

router.get("/obrasEmp/:id", async (req, res) => {
  try {
    const obras = await prisma.obras.findMany({
      where: {
        idEmp: parseInt(req.params.id),
      },
      include: {
        detalle_obra: true,
        actividades_empleados: true,
        empleado: true,
        cliente: true
      },
    });

    const obrasAct = await prisma.actividades_empleados.findMany({
      where: {
        idEmp: parseInt(req.params.id),
      },
      include: {
        obras: true,
      },
    });
    console.log(obras);
    // Utilizamos un Set para almacenar las obras únicas
    const obrasUnicas = new Set();

    obras.forEach((obra) => {
      obrasUnicas.add(JSON.stringify(obra));
    });

    // obrasAct.forEach((actividad) => {
    //   actividad.obras.forEach((obra) => {
    //     obrasUnicas.add(JSON.stringify(obra));
    //   });
    // });

    // Convertimos nuevamente las obras a objetos antes de enviar la respuesta
    const obrasUnicasArray = Array.from(obrasUnicas).map((obraString) =>
      JSON.parse(obraString)
    );

    const info = {
      obras: obrasUnicasArray,
    };

    return res.status(200).json(info);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});


router.put("/estadoAct", async (req, res) => {
  try {
    const { estado } = req.body
    const actividad = await prisma.detalle_obra.update({
      where: {
        actividad: parseInt(req.params.id)
      }, data: {
        estado: estado
      }
    }
    )
    return res.status(200).json({ message: actividad })
  } catch (error) {
    console.log(error)
  }
})




export default router
