const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const secretCode = 'inGodITrust';

module.exports = (app) => {
  const singin = (req, res, next) => {
    app.services.user.findOne({ mail: req.body.mail })
      .then((user) => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            mail: user.mail,
          };
          const token = jwt.encode(payload, secretCode);
          res.status(200).json({ token });
        }
      })
      .catch((err) => next(err));
  };
  return { singin };
};
