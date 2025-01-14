const request = require('supertest');
const app = require('../index'); // Asegúrate de exportar `app` en index.js

describe('GET /api/autos', () => {
    it('debe retornar una lista de autos', async () => {
        const res = await request(app).get('/api/autos');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
