const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'samajwadi_tech_force_secret_key_2027', {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
