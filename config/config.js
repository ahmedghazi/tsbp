const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'www'
    },
    port: process.env.PORT || 3009,
    db: 'mongodb://localhost/www-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'www'
    },
    port: process.env.PORT || 3009,
    db: 'mongodb://localhost/www-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'www'
    },
    port: process.env.PORT || 3009,
    db: 'mongodb://localhost/www-production'
  }
};

module.exports = config[env];
