const app = require('express')();

app.get('/', (req, res) => {
  return res.status(200).send('Hello World');
});

app.get('/users', (req, res) => {
  const users = [
    { name: 'Guilherme Abrantes', mail: 'guilherme@mail.com' },
  ];
  return res.status(200).json(users);
});

module.exports = app;
