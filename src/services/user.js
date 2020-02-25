module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select();
  };
  const save = async (user) => {
    if (!user.name) return { error: 'Name is mandatory submission' };
    if (!user.mail) return { error: 'Mail is mandatory submission' };
    if (!user.password) return { error: 'Password is mandatory submission' };

    const userDb = await findAll({ mail: user.mail });
    if (userDb && userDb.length > 0) return { error: 'Mail is already registered' };

    return app.db('users').insert(user, '*');
  };
  return { findAll, save };
};
