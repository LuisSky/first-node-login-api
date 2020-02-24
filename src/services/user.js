module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select();
  };
  const save = (user) => {
    if (!user.name) return { error: 'Name is mandatory submission' };
    if (!user.mail) return { error: 'Mail is mandatory submission' };
    if (!user.password) return { error: 'Password is mandatory submission' };

    return app.db('users').insert(user, '*');
  };
  return { findAll, save };
};
