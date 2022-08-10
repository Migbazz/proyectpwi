const express = require('express');
require('dotenv').config();
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 8080;

// CONEXIÓN A LA BASE DE DATO
// const conexion = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// })

// conexion.connect((err) => {
//     if (err) {
//         console.log(`Error en la conexión: ${err.stack}`)
//         return;
//     }
//     console.log(`Conectado a la Base de Datos ${process.env.DATABASE}`);
// });

// Configurar los middlewares 
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

//Configuración del motor de plantilla
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'))
hbs.registerPartials(path.join(__dirname, "views/partials"));


app.get('/', (req, res,) =>{
    res.render('index', {
        titulo: 'Bienvenidos a la App de la UTN'
    })
})

app.get('/formulario', (req, res) =>{
    res.render('formulario', {
        titulo:'Formulario para Productos',
        style: 'formulario.css'
    })
});

// app.get('/productos', (req, res) =>{
    
//     let sql = 'SELECT * FROM productos';

//     conexion.query(sql, (err, result) =>{
//         if (err) throw err;
//         res.render('productos', {
//             titulo:'Formulario para Productos', 
//             results: result
//         });
//     });
        
// });

app.get('/contacto', (req,res) =>{
    res.render('contacto',{
        titulo: 'Formulario para Suscripción'
    })
});



app.post('/contacto', (req,res) =>{
    const {nombre, email} = req.body


    if (nombre == '' || email == '') {
        let validacion = 'Rellene la Suscripción correctamente..';
        res.render('contacto', {
            titulo:'Formulario para Suscripcion',           
            validacion
        });
    } else   {

        console.log(nombre);
        console.log(email);

        async function envioMail(){

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.USEREMAIL,
                    pass: process.env.PASSWORDEMAIL
                }
            });

            let envio = await transporter.sendMail({
                from: process.env.USEREMAIL,
                to: `${email}`,
                subject: 'Gracias por Suscribirse a nuestra Empresa',
                html: `Muchas gracias por contactarnos, estaremos enviando su pedido a la brevedad. <br>
                Todas nuestras promociones, ya estarán a su disposición`
            });

            // res.send(`Tu nombre es  ${nombre} y tu email registrado es ${email}`)
            res.render('enviado', {
                titulo: 'Email Enviado',
                nombre,
                email
                })
            }
            envioMail()
        }        
})

app.post('/formulario', (req, res) =>{
    
    //Desestructuración de datos (desestructuring)
    // const {nombre, apellido, dni} = req.body;
    const { nombre, precio } = req.body;

    //Asigno datos a las variables enviadas desde el front
    // let nombre = req.body.nombre;
    // let precio = req.body.precio;

    console.log(nombre, precio);
    // == '' (si está vacío)
    if (nombre == '' || precio == '') {
        let validacion = 'Rellene los campos correctamente..';
        res.render('formulario', {
            titulo:'Formulario para Productos',           
            validacion
        });
    } else {
        
            let datos = {
                nombre: nombre,
                precio: precio
            };

            let sql = 'INSERT INTO productos SET ?';

            conexion.query(sql, datos, (err, result) =>{
                if (err) throw err;
                res.render('formulario', {
                    titulo:'Formulario para Productos'
                })
            })
        
    }})


    // res.send(`Tus datos fueron han sido recibidos: Nombre: ${nombre} , Precio: ${precio}`);
    
        



app.listen(PORT, () => {
    // console.log(`El servidor está trabajando en el Puerto ${PORT}`);
})

