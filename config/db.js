//Accedemos a la base de datos
require('dotenv').config()
//Accedemos al archivo .env en donde se encuentran las claves de acceso
const mysql = require('mysql2/promise')

//Pool de conexion = acceso
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

//Usar el recurso en otra parte de la APP
module.exports = pool;