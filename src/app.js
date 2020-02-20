const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexFile = require('../knexfile');

app.db = knex(knexFile.test);

consign({ cwd: 'src', verbose: false })
  .include('./config/middlewares.js')
  .then('./routes/')
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  return res.status(200).send('Hello World');
});

module.exports = app;
