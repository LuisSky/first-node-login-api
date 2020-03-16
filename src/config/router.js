const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);

  const protectedRoute = express.Router();
  protectedRoute.use('/users', app.routes.users);

  app.use(app.config.passport.authenticate(), protectedRoute);
};
