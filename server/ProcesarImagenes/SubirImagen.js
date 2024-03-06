import multer from 'multer';
import configurarMulter from '../database/multerConfig.js';

const subirArchivoProducto = (req, res, next) => {
  // Pasar la configuración y el nombre del campo como se llama en el formulario
  const upload = multer(configurarMulter('images')).single('imagen');

  upload(req, res, function (error) {
    if (error) {
      return res.json({ mensaje: error.message });
    }
    return next();
  });
};

export default subirArchivoProducto;
