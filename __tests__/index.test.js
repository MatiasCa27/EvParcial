const request = require('supertest');
const app = require('../index');

describe('API Tests', () => {
  test('GET / responde con 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  test('GET /saludo/:nombre responde con saludo personalizado', async () => {
    const res = await request(app).get('/saludo/Juan');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Juan');
  });

  test('POST /usuario retorna usuario creado', async () => {
    const res = await request(app)
      .post('/usuario')
      .send({ nombre: 'Ana' });
    expect(res.statusCode).toBe(200);
    expect(res.body.mensaje).toBe('Usuario creado');
  });
});