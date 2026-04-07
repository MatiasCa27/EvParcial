const express = require('express');

const app = express();



// Middleware para leer JSON

app.use(express.json());



// Ruta GET básica

app.get('/', (req, res) => {

    res.send('Hola mundo 🌍');

});



// Ruta GET con parámetro

app.get('/saludo/:nombre', (req, res) => {

    const nombre = req.params.nombre;

    res.send(`Hola ${nombre}`);

});



// Ruta POST

app.post('/usuario', (req, res) => {

    const data = req.body;

    res.json({

        mensaje: 'Usuario creado',

        data: data

    });

});



// Levantar servidor

app.listen(3000, () => {

    console.log('Servidor corriendo en localhost:3000');

});