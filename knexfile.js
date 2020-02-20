module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'password',
      database: 'db_users',
    },
    migrations: {
      directory: 'src/migrations',
    },
  },
};
