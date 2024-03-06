import {pool} from "../db.js"
export const getObras = async (req,res) =>{
    try {
        const [result] = await pool.query('SELECT *FROM obras ORDER BY idObra DESC')
        res.json(result)            
    } catch (error) {
        return res.status(500).json({message: error.message})
    }         
}

export const getObra = async (req,res) =>{
    try {
        const [result] = await pool.query('SELECT *FROM obras WHERE idObra = ?', [req.params.id])
        if (result.length === 0) {
        return res.status(404).json({mensaje:"No se pudo encontrar la obra"})        
        }
        return res.json(result[0])        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const createObra = async (req,res) =>{
    try {
        const {descripcion, estado, cantidad, fechaini, fechafin, cliente, empleado} = req.body
        const [result] = await pool.query('INSERT INTO obras(descripcion, estado, cantidad, fechaini, fechafin, idCliente, idEmpl) VALUES(?,?,?,?,?,?,?)',[descripcion, estado, cantidad, fechaini, fechafin, cliente, empleado])
        console.log(result)
        res.json({
            id:"Id insertado:"+result.insertId,
            descripcion,
            estado,
            cantidad,
            fechaini,
            fechafin,
            cliente,
            empleado
        })        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

export const updateObra = async (req,res) =>{
    try {
        const [result] = await pool.query('UPDATE obras SET ? WHERE idObra = ?', [req.body, req.params.id])
        if (result.affectedRows === 0) {
        return res.status(404).json({mensaje:"No se pudo encontrar la obra"})        
        }
        return res.status(204).send("Obra actualizada con exito!")        
    } catch (error) {
        return res.status(500).json({message: error.message})   
    }
}

export const deleteObra = async (req,res) =>{
    try {
        const [result] = await pool.query('DELETE FROM obras WHERE idObra = ?', [req.params.id])  
        if (result.affectedRows ==0) {
            return res.status(404).json({mensage:"Obra no encontrada"})
        }
        return res.status(204).send("Obra eliminada con exito")        
    } catch (error) {
        return res.status(500).json({message: error.message})           
    }
}