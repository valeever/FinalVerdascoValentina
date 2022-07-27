//Const
const express = require ('express');
const app = express();
require('dotenv').config(); 
const Port = process.env.PORT || 8080;
const hbs = require('hbs');
const mysql = require('mysql2');
const path = require('path');
const nodemailer = require ('nodemailer'); //libreria para enviar correos electronicos
const { redirect } = require('express/lib/response');

//Para que lea los motores de plantilla
app.set('view engine', 'hbs'); 
app.set('views', path.join(__dirname, 'views'));
console.log(__dirname);
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({extended: false}));

// Conexion a base de datos
const conexion = mysql.createConnection({
    Port: process.env.PORT,
    host: process.env.HOST,
    user:process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORTDB,
    database: process.env.DATABASE,
});

//Conectar base de datos
const conectar = (
    conexion.connect((error) =>{
    if(error) throw error;
    console.log('Base de datos conectada');   
})
);

//Para verificar que este corriendo en el puerto
app.listen(Port, ()=>{
    console.log(`Servidor corriendo en el puerto ${Port}`);
});

//Respuesta con texto
app.get('/', (req,res)=>{
    res.render('index', {titulo:'BIENVENIDOS A MI PAGINA WEB'})
}); 

app.get('/contacto', (req,res)=>{
    res.render('contacto', {titulo:'Contacto'})
}); 

app.get('/cursos', (req,res)=>{
    res.render('cursos', {titulo:'CURSOS GRATUITOS'})
});

app.get('/lenguajes', (req,res)=>{
    res.render('lenguajes', {titulo:'ALGUNOS TEMAS VISTOS EN LA PRIMERA PARTE'})
}); 

app.on('error',(error) => {
    console.log(`Tenemos un error ${error}`);
});

app.post('/contacto', (req,res)=>{
    console.log(req.body);

    const{ id_nombre , id_apellido , id_correo , id_telefono, id_motivo } = req.body;

    console.log(id_nombre);
    console.log(id_apellido);
    console.log(id_correo);
    console.log(id_telefono);
    console.log(id_motivo);

    //validacion basica
    if(id_nombre == "" || id_telefono == ""){
        let validacion = 'Faltan datos para que te pueda contactar'

        res.render('contacto', {
        titulo: 'Contacto',
        validacion
    }) 
    } else { 
        //llamar funcion de MYSQL
        //conectar();
            let data = {
            id_nombre: id_nombre,
            id_apellido: id_apellido,
            id_correo: id_correo,
            id_telefono: id_telefono,
            id_motivo: id_motivo,
        }
        let sql = "INSERT INTO TablaDatos SET ?";
        let query = conexion.query(sql, data, (err, results)=>{
            if (err) throw err;
            res.render('contacto', {titulo: 'Contacto'})});
    }
})
