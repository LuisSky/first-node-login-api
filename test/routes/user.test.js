const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const mail = `${Date.now()}@mail.com`;

let User = {};
beforeAll(async () => {
  const res = await app.services.user.save({ name: 'user testing', mail: `${Date.now()}@mail.com`, password: '123456' });
  User = { ...res };
  User.token = jwt.encode(User, 'inGodITrust');
});

test('list users', async () => {
  return request(app).post('/users')
    .send({ name: 'User Testing', mail: `${Date.now()}@mail.com`, password: '123456' })
    .then(() => request(app).get('/users').set('authorization', `bearer ${User.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('insert user for post method', () => {
  return request(app).post('/users')
    .send({ name: 'User Testing', mail, password: '123456' })
    .set('authorization', `bearer ${User.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', 'User Testing');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Encrypted password', async () => {
  const res = await request(app).post('/users')
    .send({ name: 'User Testing', mail: `${Date.now()}@mail.com`, password: '123456' })
    .set('authorization', `bearer ${User.token}`);

  expect(res.status).toBe(201);

  const { id } = res.body;
  const UserDB = await app.services.user.findOne({ id });
  expect(UserDB.password).not.toBe('123456');
});

describe('Invalid submissions', () => {
  const templateValidSubmission = (newData, errorMessage) => {
    const validData = { name: 'Invalid User', mail: `${Date.now()}@mail.com`, password: '123456' };
    return request(app).post('/users')
      .send({ ...validData, ...newData })
      .set('authorization', `bearer ${User.token}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Blocking null name submission', () => templateValidSubmission({ name: null }, 'Name is mandatory submission'));
  test('Blocking null mail submission', () => templateValidSubmission({ mail: null }, 'Mail is mandatory submission'));
  test('Blocking null password submission', () => templateValidSubmission({ password: null }, 'Password is mandatory submission'));
  test('Blocking null existing mail', () => templateValidSubmission({ mail }, 'Mail is already registered'));
});
