const request = require('supertest');

const app = require('../../src/app');

test('list users', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('insert user for post method', () => {
  const mail = `${Date.now()}@mail.com`;
  return request(app).post('/users')
    .send({ name: 'Sky Nesk', mail, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body[0]).toHaveProperty('name', 'Sky Nesk');
    });
});

test('Blocking null name submission', () => {
  return request(app).post('/users')
    .send({ mail: 'jhon@mail.com', password: '123456' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name is mandatory submission');
    });
});
