module.exports = (app) => {
  app.route('/auth/singin')
    .post(app.routes.auth.singin);

  app.route('/users')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);
};
