const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const mail = `${Date.now()}@mail.com`;

let User = {};
beforeAll(async () => {
  const res = await app.services.user.save({ name: 'user testing', mail: `${Date.now()}@mail.com`, password: '123456' });
  User = { ...res[0] };
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
      expect(res.body[0]).toHaveProperty('name', 'User Testing');
      expect(res.body[0]).not.toHaveProperty('password');
    });
});

test('Encrypted password', async () => {
  const res = await request(app).post('/users')
    .send({ name: 'User Testing', mail: `${Date.now()}@mail.com`, password: '123456' })
    .set('authorization', `bearer ${User.token}`);

  expect(res.status).toBe(201);

  const { id } = res.body[0];
  const UserDB = await app.services.user.findOne({ id });
  expect(UserDB.password).not.toBe('123456');
});

test('Blocking null name submission', () => {
  return request(app).post('/users')
    .send({ mail: 'jhon@mail.com', password: '123456' })
    .set('authorization', `bearer ${User.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name is mandatory submission');
    });
});

test('Blocking null mail submission', () => {
  return request(app).post('/users')
    .send({ name: 'User Testing', password: '123456' })
    .set('authorization', `bearer ${User.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Mail is mandatory submission');
    });
});

test('Blocking null password submission', () => {
  return request(app).post('/users')
    .send({ name: 'User Testing', mail: 'user@mail.com' })
    .set('authorization', `bearer ${User.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Password is mandatory submission');
    });
});

test('Blocking submission existing mail', () => {
  return request(app).post('/users')
    .send({ name: 'User Testing', mail, password: '123456' })
    .set('authorization', `bearer ${User.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Mail is already registered');
    });
});
