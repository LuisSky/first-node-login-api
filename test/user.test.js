const request = require('supertest');

const app = require('../src/app');

test('list users', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('name', 'Guilherme Abrantes');
    });
});

test('insert user post method', () => {
  return request(app).post('/users')
    .send({ name: 'Sky Nesk', mail: 'sky@mail.com' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'Sky Nesk');
    });
});
