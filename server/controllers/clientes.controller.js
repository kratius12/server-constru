import {pool} from "../db.js"
export const getClientes = async (req,res) =>{
    try {
        const [result] = await pool.query('SELECT *FROM cliente ORDER BY idCli DESC')
        res.json(result)            
    } catch (error) {
        return res.status(500).json({message: error.message})
    }         
}

export const getCliente = async (req,res) =>{
    try {
        const [result] = await pool.query('SELECT *FROM cliente WHERE idCli = ?', [req.params.id])
        if (result.length === 0) {
        return res.status(404).json({mensaje:"No se pudo encontrar el cliente"})        
        }
        return res.json(result[0])        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const createCliente = async (req,res) =>{
    try {
        const {nombre, email, direccion, telefono, cedula, fecha_nac, estado} = req.body
        const [result] = await pool.query('INSERT INTO cliente(nombre, email, direccion, telefono, cedula, fecha_nac, estado) VALUES(?,?,?,?,?,?,?)',[nombre, email, direccion, telefono, cedula, fecha_nac, estado])
        console.log(result)
        res.json({
            id:"Id insertado:"+result.insertId,
            nombre, 
            email, 
            direccion, 
            telefono, 
            cedula, 
            fecha_nac, 
            estado
        })        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

export const updateCliente = async (req,res) =>{
    try {
        const [result] = await pool.query('UPDATE cliente SET ? WHERE idCli = ?', [req.body, req.params.id])
        if (result.affectedRows === 0) {
        return res.status(404).json({mensaje:"No se pudo encontrar el cliente"})        
        }
        return res.status(204).send("Cliente actualizado con exito!")        
    } catch (error) {
        return res.status(500).json({message: error.message})   
    }
}

export const deleteCliente = async (req,res) =>{
    try {
        const [result] = await pool.query('DELETE FROM cliente WHERE idCli = ?', [req.params.id])  
        if (result.affectedRows ==0) {
            return res.status(404).json({mensage:"Cliente no encontrado"})
        }
        return res.status(204).send("Cliente eliminado con exito")        
    } catch (error) {
        return res.status(500).json({message: error.message})           
    }
}