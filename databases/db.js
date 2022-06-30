const mysql = require('mysql');
const connection = mysql.createConnection({
    // host: process.env.DB_HOST,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env_DB_DATABASE
    host:'localhost',
    user:'root',
    password:'',
    database:'intranetmunicipal'
});

connection.connect((error)=>{
    if(error){
        console.log('el error de coneccion es: ' +error);
        return;
    }
    console.log('conectado a la base de datos');
});
module.exports = connection;