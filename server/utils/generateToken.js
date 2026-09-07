const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'shopsphere_super_secret_jwt_key_2025_codealpha_fullstack', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
