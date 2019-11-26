const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const projectDir = path.resolve(__dirname, '..');

if (process.env.NODE_ENV !== 'production') {
  const fullEnvPath = path.resolve(projectDir, `.env.${process.env.NODE_ENV}`);
  const shortEnvPath = path.resolve(projectDir, '.env');

  if (fs.existsSync(fullEnvPath)) {
    dotenv.config({ path: fullEnvPath });
  } else {
    dotenv.config({ path: shortEnvPath });
  }
}
