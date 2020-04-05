const request = require('supertest');
const app = require('../../src/app.js');

const MAIN_ROUTE = '/auth';

describe('when create user with signup', () => {
  it('should return all values in body of response with except the password', () => {
    return request(app).post(`${MAIN_ROUTE}/signup`)
      .send({ name: 'user testing', mail: `${Date.now()}@mail.com`, password: '123456' })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('user testing');
        expect(res.body).toHaveProperty('mail');
        expect(res.body).not.toHaveProperty('password');
      });
  });
});

describe('when submission is invalid data ', () => {
  const mail = `${Date.now()}@mail.com`;

  beforeAll(async () => {
    await app.services.user.save({ name: 'User Testing', mail, password: '123456' });
  });

  const templateValidLogin = (dataOverWrite, errorMessage) => {
    request(app).post(`${MAIN_ROUTE}/signin`)
      .send({ ...dataOverWrite })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  it('lock wrong password', () => templateValidLogin({ mail, password: '654321' }, 'Invalid user and password'));
  it('lock mail non existence', () => templateValidLogin({ mail: 'testingemail5465465_@bgds.com', password: '654321' }, 'Invalid user and password'));
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

test('must not access a tokenless route', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(401); // Acess not autorized.
    });
});
