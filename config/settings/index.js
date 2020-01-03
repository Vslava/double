require('../init-dotenv');

const defaults = require('./default.js');

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`./${env}.js`);

module.exports = { ...defaults, ...config };
