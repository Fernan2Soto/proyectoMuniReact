const express = require('express');
const app = express();

//capturar datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//llamados env
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//directorio public
app.use('/resources', express.static('public'));
app.use('/resources',express.static(__dirname + '/public'));

//plantilla
app.set('view engine','ejs');

//bcryptjs
const bcryptjs=require('bcryptjs');

//var session
const session = require('express-session');
const { connect } = require('./databases/db');
const connection = require('./databases/db');
const { scryRenderedComponentsWithType } = require('react-dom/test-utils');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

console.log(__dirname);

//modulo connecio
require('./databases/db');


//establecer rutas
app.get('/',(req, res)=>{
    res.render('index',{msg:'mensaje de node'});
});

app.get('/login',(req, res)=>{
    res.render('login');
})

app.get('/register',(req, res)=>{
    res.render('register');
})

//registros
app.post('/register', async (req ,res)=>{
    const user = req.body.nombre;
    const email = req.body.email;
    const pass = req.body.password;
    
    let passwordHaash = await bcryptjs.hash(pass, 8);
    
    connection.query('INSERT INTO users SET ?',{name:user,email:email,password:passwordHaash},async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register',{
                alert:true,
                alertTitle:"Registrado",
                alertMessage:"registrado en exito",
                alertIcon:'success',
                showConfirmButton:false,
                timer:2500,
                ruta:''
            });
        }
    })

})

//login
app.post('/auth', async(req ,res)=>{
    const email =req.body.email;
    const pass =req.body.password;

    let passwordHaash = await bcryptjs.hash(pass, 8);
     if(email && pass){
        connection.query('SELECT * FROM users WHERE email = ?',[email], async(error,results)=>{
            // console.log(results);
            if(!(passwordHaash.localeCompare(pass,results[0].pass))){
                res.send('usuario Y/O password incorrecto');
            }else{
                res.send('Login correcto');
            }
        })
     }

})


app.listen(3000,(req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})


