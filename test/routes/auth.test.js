const request = require('supertest');
const app = require('../../src/app.js');

const MAIN_ROUTE = '/auth';

test('create user whit signup', () => {
  return request(app).post('/auth/signup')
    .send({ name: 'user testing', mail: `${Date.now()}@mail.com`, password: '123456' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body[0].name).toBe('user testing');
      expect(res.body[0]).toHaveProperty('mail');
      expect(res.body[0]).not.toHaveProperty('password');
    });
});

test('receive token when logged', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save({ name: 'User Testing', mail, password: '123456' })
    .then(() => request(app).post(`${MAIN_ROUTE}/signin`)
      .send({ mail, password: '123456' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('lock wrong password', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save({ name: 'User Testing', mail, password: '123456' })
    .then(() => request(app).post(`${MAIN_ROUTE}/signin`)
      .send({ mail, password: '654321' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid user and password');
    });
});

test('lock mail non existence', () => {
  return request(app).post(`${MAIN_ROUTE}/signin`)
    .send({ mail: 'testingmail54612_@mail.com' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid user and password');
    });
});

test('must not access a tokenless route', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(401); // Acess not autorized.
    });
});
