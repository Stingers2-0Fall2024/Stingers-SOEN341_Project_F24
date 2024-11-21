const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

test('POST /auth/login - should return a token on successful login', async () => {
  const res = await request(app).post('/auth/login').send({
    username: 'testuser',
    password: 'password123',
  });

  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty('token');
});

test('POST /auth/login - should return 401 on invalid credentials', async () => {
  const res = await request(app).post('/auth/login').send({
    username: 'testuser',
    password: 'wrongpassword',
  });

  expect(res.status).toBe(401);
  expect(res.body).toHaveProperty('error');
});
