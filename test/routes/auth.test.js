const request = require('supertest');
const app = require('../../src/app.js');

const MAIN_ROUTE = '/auth';

test('receive token when logged', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save({ name: 'User Testing', mail, password: '123456' })
    .then(() => request(app).post(`${MAIN_ROUTE}/singin`)
      .send({ mail, password: '123456' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('lock wrong password', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save({ name: 'User Testing', mail, password: '123456' })
    .then(() => request(app).post(`${MAIN_ROUTE}/singin`)
      .send({ mail, password: '654321' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Inválid user and password');
    });
});

test('lock mail non existence', () => {
  return request(app).post(`${MAIN_ROUTE}/singin`)
    .send({ mail: 'testingmail54612_@mail.com' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid user and password');
    });
});
