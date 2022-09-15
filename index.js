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
    res.render('index')
})

app.get('/nosotros', (req,res) =>{
    res.render('nosotros')
})

app.get('/listacontactos', (req, res) =>{

    // ---RENDER PARA PODER SUBIR A HEROKU.. 
         // COMENTAR EN MODO LOCAL 
        res.render('listacontactos')
    
        // let sql = 'SELECT * FROM contactoss';
    
        // conexion.query(sql, (err, result) =>{
        //     if (err) throw err;
        //     res.render('listacontactos', {
        //         titulo:'Visitas', 
        //         results: result
        //     });
        // });
            
    });

app.get('/contacto', (req,res) =>{
    res.render('contacto')
});


app.post('/contacto', (req, res) => {
    const { nombre, email } = req.body;

    if (nombre == "" || email == "") {
    res.render('contacto');
    } else {
        //POR FAVOR, AL DESCOMENTAR SQL, COMENTAR LA LINEA 106 y 110
    // let datos = {
    //     nombre: nombre,
    //     email: email
    // };

    // let sql = 'INSERT INTO contactoss SET ?';

    // conexion.query(sql, datos, (err, result) => {
    //     if (err) throw err;
    //     res.render('enviado'); 
    //     });
    // };
    async function envioMail() {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USEREMAIL,
                pass: process.env.PASSWORDEMAIL
        },
        });

        let envio = await transporter.sendMail({
            from: process.env.USEREMAIL,
            to: `${email}`,
            subject: "Gracias por Suscribirse",
            html: `Muchas gracias por contactar con nosotros. <br>
            Todas nuestras promociones estaran a su disposicion.`,
        });
        //EN PRUEBA LOCAL COMENTAR LINEA 106.
        res.render('enviado');
    }
    envioMail();
    // COMENTAR LA LLAVE CUANDO SE PRUEBE MODO LOCAL
    }
});
    
app.listen(PORT, () => {
    // console.log(`El servidor está trabajando en el Puerto ${PORT}`);
})

