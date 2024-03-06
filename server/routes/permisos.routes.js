import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ucfirst } from '../plugins.js';
const prisma = new PrismaClient();
const router = Router();

router.get('/permisos', async (req, res) => {
        try {
                const result = await prisma.permiso.findMany()
                return res.status(200).json(result)
        } catch (error) {
                console.log(error);
                return res.status(500).json(error)
        }
});
router.get('/permisosAct', async (req, res) => {
        try {
                const result = await prisma.permiso.findMany({
                        where: {
                                estado: 1
                        }
                })
                return res.status(200).json(result)
        } catch (error) {
                console.log(error);
                return res.status(500).json(error)
        }
});

router.get('/permisos/:id', async (req, res) => {
        try {
                const result = await prisma.permiso.findFirst({
                        where: {
                                idPer: parseInt(req.params.id)
                        }
                })
                console.log(result);
                return res.status(200).json(result);
        } catch (error) {
                console.log(error);
                return res.status(500).json(error);
        }
});

router.post('/permisos', async (req, res) => {
        try {
                const { permiso, estado } = req.body
                const result = await prisma.permiso.create({
                        data: {
                                permiso: ucfirst(permiso),
                                estado: parseInt(estado)
                        }
                })
                console.log(result);
                return res.status(200).json(result);
        } catch (error) {
                return res.status(500).json(error);
        }
});

router.put('/permisos/:id', async (req, res) => {
        try {
                const { permiso, estado } = req.body
                const result = await prisma.permiso.update({
                        where: {
                                idPer: parseInt(req.params.id)
                        }, data: {
                                permiso: ucfirst(permiso),
                                estado: parseInt(estado)
                        }
                })
                console.log(result);
                return res.status(200).json(result)
        } catch (error) {
                console.log(error);
                return res.status(500).json(error)
        }
});

router.delete('/permisos/:id', async (req, res) => {
        try {
                const result = await prisma.permiso.delete({
                        where: {
                                idPer: parseInt(req.params.id)
                        }
                })
                console.log(result);
                return res.status(200).json(result)
        } catch (error) {
                console.log(error);
                return res.status(500).json(error)
        }
})

export default router
