import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import shortid from 'shortid';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configurarMulter = (directorio) => {
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../${directorio}`);
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  });

  const configurationMulter = {
    storage: fileStorage,
    fileFilter(req, file, cb) {
      if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' ) {
        cb(null, true);
      } else {
        cb(new Error('Formato No válido'));
      }
    },
  };

  return configurationMulter;
};

export default configurarMulter;
