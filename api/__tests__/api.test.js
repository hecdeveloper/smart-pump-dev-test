const request = require('supertest');
const app = require('../server'); // Asegúrate de que apunta al servidor correcto

describe('API Tests', () => {
  it('should return 401 for accessing profile without token', async () => {
    const res = await request(app).get('/api/profile');

    console.log('Profile response without token:', res.statusCode, res.body);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'No token provided');
  });
});
