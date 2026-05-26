const request = require('supertest');
const app = require('../index');

describe('Pruebas del microservicio', () => {
  test('Debe responder en la ruta principal', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});