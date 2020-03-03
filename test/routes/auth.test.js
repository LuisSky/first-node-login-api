const request = require('supertest');
const app = require('../../src/app.js');
const ValidationError = require('../../src/errors/ValidationError.js');

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
