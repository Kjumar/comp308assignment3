var dotenv = require('dotenv');

dotenv.config();

const private_key = Buffer.from(process.env.PRIVATE_KEY, "base64").toString('ascii');
const public_key = Buffer.from(process.env.PUBLIC_KEY, "base64").toString('ascii');

module.exports = { private_key, public_key };