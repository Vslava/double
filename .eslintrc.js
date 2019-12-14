module.exports = {
  "extends": "airbnb-base",
  "parserOptions": {
    "ecmaVersion": 2018,
  },
  "env": {
    "node": true,
    "jest/globals": true,
  },
  "plugins": [
    "jest",
  ],
  "extends": [
    "plugin:jest/all",
  ],
  "rules": {
    "no-console": "off",
  },
};
