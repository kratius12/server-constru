import express from "express";
import cors from "cors";
import {dirname, join} from "path";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";
import { PORT } from "./config.js";
import indexRoutes from "./routes/index.routes.js"
import obrasRoutes from "./routes/obras.routes.js"
import materialesRoutes from "./routes/materiales.routes.js"
import clientesRoutes from "./routes/clientes.routes.js";
import empleadosRoutes from "./routes/empleados.routes.js";
import especialidadRoutes from "./routes/especialidades.routes.js"
import categoriasRoutes from "./routes/categorias.routes.js"
import proveedoresRoutes from './routes/proveedores.routes.js'
import rolesRoutes from "./routes/roles.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import permisosRoutes from "./routes/permisos.routes.js";
import comprasRoutes from './routes/compras.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import loginRoutes from './routes/login.routes.js'
import exphbs from "express-handlebars";
const app = express()
const _dirname = dirname(fileURLToPath(import.meta.url))
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(indexRoutes)
app.use(obrasRoutes)
app.use(materialesRoutes)
app.use(clientesRoutes)
app.use(empleadosRoutes)
app.use(proveedoresRoutes)
app.use(especialidadRoutes)
app.use(categoriasRoutes)
app.use(rolesRoutes)
app.use(usuariosRoutes)
app.use(permisosRoutes)
app.use(comprasRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(dashboardRoutes)
app.use(loginRoutes)

app.use(express.static(join(_dirname,"../client/dist")))
app.listen(PORT)
console.log("server listeing in port: "+PORT)


app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs', 
    defaultLayout: "main", 
    helpers:{ 
        calculo: function (value) {
                return value + 7;
        },
        switchStatus: function (value){
            if (value ===1) {
                return "checked";
            }else{
                return "";
            }
        },
        selectOptionSelected: function(value){
            if (value ===1) {
                return "selected"
            }else if(value ===0){
                return "selected"
            }
        }


    }
}));
app.set('view engine', 'hbs');

app.use('*/Bootstrap-4-Multi-Select-BsMultiSelect',express.static('public/Bootstrap-4-Multi-Select-BsMultiSelect'));
app.use('*/css',express.static('public/css'));
app.use('*/js',express.static('public/js'));
app.use('*/images',express.static('public/images'));

app.get('/testhtml', (req, res) => {
    res.render('home');
});