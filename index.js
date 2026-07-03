const express = require('express');
const logger = require('./logger'); 

const app = express();



// Middleware para leer JSON
app.use(express.json());


app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration
    });
  });
  next();
});


// Ruta GET básica
app.get('/', (req, res) => {

    res.send('Hola mundo 🌍 - version final test 13');

});



// Ruta GET con parámetro

app.get('/saludo/:nombre', (req, res) => {

    const nombre = req.params.nombre;

    res.send(`Hola ${nombre} bienvenido a este mundo`);
});

//`Hola ${nombre}, bienvenido a este mundo`


// Ruta POST
app.post('/usuario', (req, res) => {
    const data = req.body;
    res.json({
        mensaje: 'Usuario creado',
        data: data
    });
});

app.use((err, req, res, next) => {
  logger.error('Error no controlado', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
  });
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Levantar servidor solo si se ejecuta directamente
if (require.main === module) {
    app.listen(3000, () => {
       console.log('Servidor corriendo en localhost:3000');
    });

}

module.exports = app;
