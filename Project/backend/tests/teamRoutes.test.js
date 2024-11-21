const request = require('supertest');
const express = require('express');
const teamRoutes = require('../routes/teamRoutes');

const app = express();
app.use(express.json());
app.use('/teams', teamRoutes);

test('GET /teams - should return all teams', async () => {
  const res = await request(app).get('/teams');

  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});
