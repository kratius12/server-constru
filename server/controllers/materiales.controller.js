import {pool} from "../db.js"
export const getMateriales = async (req,res) =>{
    try {
        const [result] = await pool.query('SELECT *FROM materiales ORDER BY idMat DESC')
        res.json(result)            
    } catch (error) {
        return res.status(500).json({message: error.message})
    }         
}

export const getMaterial = async (req,res) =>{
    try {
        const [result] = await pool.query('SELECT *FROM materiales WHERE idMat = ?', [req.params.id])
        if (result.length === 0) {
        return res.status(404).json({mensaje:"No se pudo encontrar el material"})        
        }
        return res.json(result[0])        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const createMaterial = async (req,res) =>{
    try {
        const {nombre, idProveedor, estado, precio, cantidad, idCategoria} = req.body
        const [result] = await pool.query('INSERT INTO materiales(nombre, idProveedor, estado, precio, cantidad, idCategoria) VALUES(?,?,?,?,?,?)',[nombre, idProveedor, estado, precio, cantidad, idCategoria])
        console.log(result)
        res.json({
            id:"Id insertado:"+result.insertId,
            nombre,
            idProveedor,
            estado,
            precio,
            cantidad,
            idCategoria
        })        
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

export const updateMaterial = async (req,res) =>{
    try {
        const [result] = await pool.query('UPDATE materiales SET ? WHERE idMat = ?', [req.body, req.params.id])
        if (result.affectedRows === 0) {
        return res.status(404).json({mensaje:"No se pudo encontrar el material"})        
        }
        return res.status(204).json({mensaje:"Material actualizado con exito!"})        
    } catch (error) {
        return res.status(500).json({message: error.message})   
    }
}

export const deleteMaterial = async (req,res) =>{
    try {
        const [result] = await pool.query('DELETE FROM materiales WHERE idMat = ?', [req.params.id])  
        if (result.affectedRows ==0) {
            return res.status(404).json({mensage:"Material no encontrada"})
        }
        return res.status(204).send("Material eliminado con exito")        
    } catch (error) {
        return res.status(500).json({message: error.message})           
    }
}