const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'tsbp'
    },
    port: process.env.PORT || 3009,
    db: 'mongodb://localhost/tsbp-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'tsbp'
    },
    port: process.env.PORT || 3009,
    db: 'mongodb://localhost/tsbp-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'tsbp'
    },
    port: process.env.PORT || 3009,
    db: 'mongodb://localhost/tsbp-production'
  }
};

module.exports = config[env];
