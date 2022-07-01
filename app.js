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
app.get('/index',(req, res)=>{
    res.render('index');
})

//registros
app.post('/register', async (req ,res)=>{
    const user = req.body.nombre;
    const email = req.body.email;
    const pass = req.body.password;
    const Repass = req.body.Repassword;

    connection.query('SELECT * FROM users WHERE email = ?',[email], async(error,results)=>{
        if(results.length !=0 ){
            res.render('register',{
                alert:true,
                alertTitle:"Error",
                alertMessage:"Email ya existente",
                alertIcon:'error',
                showConfirmButton:false,
                timer:2500,
                ruta:''
            })
        }
    });

    if(pass == Repass){
        console.log('contraseñas iguales');
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
                ruta:'/login'
            });
            console.log(results);
            console.log(error);
        }
    })}else{
        res.render('register',{
            alert:true,
            alertTitle:"Error",
            alertMessage:"Las contraseñas deben ser iguales",
            alertIcon:'error',
            showConfirmButton:false,
            timer:2500,
            ruta:''
        })
    }

})

//login
app.post('/auth', async(req ,res)=>{
    const email =req.body.email;
    const password =req.body.password;

     if(email && password){
         connection.query(`SELECT * FROM users WHERE email = ?`,[email], async(error,results)=>{

         if(results.length != 0){
                console.log('primer if')
                if(await bcryptjs.compare(password, results[0].password)){
                    console.log('primer await')
                    console.log(results);
                    console.log(error);
                    req.session.name = results[0].name;
                    res.render('login',{
                        alert:true,
                        alertTitle:"Bienvenido",
                        alertMessage:"Logeado con exito",
                        alertIcon:"success",
                        showConfirmButton:true,
                        timer:1500,
                        ruta:'index'
                    });

                    
                }else{
                    res.render('login',{
                        alert:true,
                        alertTitle:"Error",
                        alertMessage:"Contraseña incorrecta",
                        alertIcon:"error",
                        showConfirmButton:true,
                        timer:false,
                        ruta:'login'
                    });
                console.log('contraseña incorrecta')
            }
         }else{
            res.render('login',{
                alert:true,
                alertTitle:"Error",
                alertMessage:"Usuario incorrecto",
                alertIcon:"error",
                showConfirmButton:true,
                timer:false,
                ruta:'login'
            });
                console.log('error usurio incorrecto');
                console.log(results);
        }
        })
     }

})


app.listen(3000,(req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3000');
})




