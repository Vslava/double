module.exports = {
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
    "airbnb-base",
    "eslint:recommended",
    "plugin:jest/all",
  ],
  "rules": {
    "no-console": "off",
    "jest/valid-title": "off",
    "import/no-extraneous-dependencies": [
      "error", {
        "devDependencies": true,
      },
    ],
  },
};
