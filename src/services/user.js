const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError.js');

const genHashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

module.exports = (app) => {
  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail']);
  };
  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };
  const save = async (user) => {
    if (!user.name) throw new ValidationError('Name is mandatory submission');
    if (!user.mail) throw new ValidationError('Mail is mandatory submission');
    if (!user.password) throw new ValidationError('Password is mandatory submission');

    const userDb = await findOne({ mail: user.mail });
    if (userDb) throw new ValidationError('Mail is already registered');

    const copyUser = { ...user };
    copyUser.password = await genHashPassword(user.password);

    return app.db('users').insert(copyUser, ['id', 'name', 'mail']);
  };
  return { findOne, findAll, save };
};
