const request = require('supertest');
const app = require('../index');

describe('Pruebas del microservicio', () => {
  test('Debe responder en la ruta principal', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Hola mundo');
  });

  test('Debe responder saludo personalizado', async () => {
    const response = await request(app).get('/saludo/Matias');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hola Matias bienvenido a este mundo');
  });

  test('Debe crear usuario con datos JSON', async () => {
    const usuario = {
      nombre: 'Matias',
      curso: 'DevOps'
    };

    const response = await request(app)
      .post('/usuario')
      .send(usuario);

    expect(response.statusCode).toBe(200);
    expect(response.body.mensaje).toBe('Usuario creado');
    expect(response.body.data).toEqual(usuario);
  });
});