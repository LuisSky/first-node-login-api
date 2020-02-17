const app = require('express')();

app.get('/', (req, res) => {
  return res.status(200).send('Hello World');
});

module.exports = app;
