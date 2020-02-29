const ValidationError = require('../errors/ValidationError.js');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select();
  };
  const save = async (user) => {
    if (!user.name) throw new ValidationError('Name is mandatory submission');
    if (!user.mail) throw new ValidationError('Mail is mandatory submission');
    if (!user.password) throw new ValidationError('Password is mandatory submission');

    const userDb = await findAll({ mail: user.mail });
    if (userDb && userDb.length > 0) throw new ValidationError('Mail is already registered');

    return app.db('users').insert(user, '*');
  };
  return { findAll, save };
};
