module.exports = (app) => {
  app.route('/auth/singin')
    .post(app.routes.auth.singin);

  app.route('/users')
    .get(app.routes.users.findAll)
    .post(app.routes.users.create);
};
