import {Router, json} from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
// import { SECRET_KEY } from '../config.js';
import { genSalt as bcryptGenSalt, hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const SECRET_KEY = process.env.SECRET_KEY
const resend = new Resend('re_cg4HtbhW_3BQtnVsVsKBhaKidq7A1GoAU');
const prisma = new PrismaClient();
const router = Router();

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await prisma.empleado.findUnique({
        where: {
          email: username,
          estado: 1,
          rolpermisoempleado:{
            some:{
               rol:{
                estado: 1
               }
            }
          }
        },
        include:{
            rolpermisoempleado:{
                select:{
                    id:true,
                    idEmp:true,
                    idPer:true,
                    idRol:true,

                    permiso:true,
                    rol:true
                }
            }
        }
      });

      if (!user) {
        res.status(404).json({ error: 'Credenciales incorrectas.' });
        return;
      }

      const passwordsMatch = await bcryptCompare(password, user.contrasena);

      if (passwordsMatch) {
        const token = jwt.sign({ idEmp: user.idEmp, nombres: user.nombre+'-'+user.apellidos, email: user.email, rolesPermisos: user.rolpermisoempleado }, SECRET_KEY, { expiresIn: '2h' });

        res.status(200).json({ token });
      } else {
        res.status(404).json({ error: 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

router.post("/loginCli", async (req,res) =>{
  try {
    const {username, password} = req.body;
    const user = await prisma.cliente.findFirst({
      where:{
          email:username,
          estado:1,
      }
    })
    if (!user) {
      res.status(404).json({ error: 'Credenciales incorrectas.' });
      return;
    }
    const passwordsMatch = await bcryptCompare(password, user.constrasena);
    console.log(passwordsMatch)

    if(passwordsMatch){
      const token = jwt.sign({ nombre: user.nombre, apellidos: user.apellidos, email: user.email, direccion: user.direccion, telefono: user.telefono, tipoDoc: user.tipoDoc,  fecha_nac: user.fecha_nac, estado: user.estado }, SECRET_KEY, { expiresIn: '2h' })
      res.status(200).json({ token });
    }else{
      res.status(200).json({message:"Error, credenciales incorrectas"})
    }

  } catch (error) {
    console.error(error)
  }
})

router.post('/sendCode', async (req, res) => {
  try {
    const now = new Date()
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')
    const {email} = req.body

    const user = await prisma.empleado.findUnique({
      where:{
        email:email
      }
    })
    if (user) {
      const code = Math.floor(1000 + Math.random() * 9000);
      await prisma.codigos.create({
        data:{
          codigo: String(code),
          email:email,
          estado: 1,
          fecha: formattedDate
        }
      })

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
          user:"construtech.soporte@gmail.com",
          pass:"tabqtlxuhpqvzajl"
        }
      })

      const mail_config = {
        from:"construtech.soporte@gmail.com",
        to: email,
        subject:'Codigo de confirmacion',
        text: `Codigo de confirmacion: ${code}`
      }

      transporter.sendMail(mail_config, function (error, info){
        if (error) {
          console.log(error)
          return res.status(204).json({message: 'Ha ocurrido un error'})
        }
        return res.status(200).json({message: 'Email enviado con exito'})
      })

      // if (error) {
      //   return res.status(400).json({error})

      // }

    }else{
      res.status(404).json({error: `No se encontro el email enviado: ${email}`})
    }

  } catch (error) {
    console.log(error)
  }
});
router.post('/sendCodeCli', async (req, res) => {
  try {
    const now = new Date()
    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ')
    const {email} = req.body

    const user = await prisma.cliente.findFirst({
      where:{
        email:email
      }
    })
    if (user) {
      const code = Math.floor(1000 + Math.random() * 9000);
      await prisma.codigos.create({
        data:{
          codigo: String(code),
          email:email,
          estado: 1,
          fecha: formattedDate
        }
      })

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
          user:"construtech.soporte@gmail.com",
          pass:"tabqtlxuhpqvzajl"
        }
      })

      const mail_config = {
        from:"construtech.soporte@gmail.com",
        to: email,
        subject:'Codigo de confirmacion',
        text: `Codigo de confirmacion: ${code}`
      }

      transporter.sendMail(mail_config, function (error, info){
        if (error) {
          console.log(error)
          return res.status(204).json({message: 'Ha ocurrido un error'})
        }
        return res.status(200).json({message: 'Email enviado con exito'})
      })


    }else{
      res.status(404).json({error: `No se encontro el email enviado: ${email}`})
    }

  } catch (error) {
    console.log(error)
  }
});

router.post('/checkCode', async (req, res) => {
  try {
    const { code, date } = req.body;

    const validCode = await prisma.codigos.findUnique({
      where: {
        codigo: code,
      },
    });

    if (validCode) {
      const dateStored = new Date(validCode.fecha);
      const minDateStores = dateStored.getMinutes()
      
      const currentDate = new Date();
      const currentDateMin = currentDate.getMinutes()
      
      const timeDifference = (minDateStores-currentDateMin)
  
      if (timeDifference < 15) {
        
        const checkedCode = await prisma.codigos.update({
          where: {
            Id: parseInt(validCode.Id),
          },
          data: {
            estado: 0,
          },
        });

        if (!checkedCode) {
          return res.status(404).json({ error: "Código inválido." });
        }

        return res.status(200).json({ success: true, code: validCode.email });
      } else {
        return res.status(203).json({
          error: "El código ingresado ha excedido el tiempo máximo (15 minutos) para ser ingresado",
        });
      }
    } else {
      return res.status(404).json({ error: "Código inválido" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});


const generarHash = async (password, saltRounds = 10) => {
  const salt = await bcryptGenSalt(saltRounds);
  const hash = await bcryptHash(password, salt);
  return hash;
};

router.post('/password', async (req, res) => {
  try {
    const {email, password} = req.body

    const user = await prisma.empleado.findUnique({
      where:{
        email:email
      }
    })

    if (user) {
      const hashedPass = await generarHash(password)
      const changePass = await prisma.empleado.update({
        where:{
          email:email
        },
        data:{
          contrasena: hashedPass
        }
      })

      if (changePass) {
        return res.status(200).json({success:true})
      }

      return res.status(400).json({error:"No se pudo cambiar la contraseña"})

    } else {
      return res.status(404).json({error:"Usuario no encontrado"})
    }

  } catch (error) {
    console.log(error)
  }

});
export default router