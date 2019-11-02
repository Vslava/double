const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  const fullEnvPath = path.resolve(`.env.${process.env.NODE_ENV}`);
  const shortEnvPath = path.resolve('.env');

  if (fs.existsSync(fullEnvPath)) {
    dotenv.config({ path: fullEnvPath });
  } else {
    dotenv.config({ path: shortEnvPath });
  }
}
