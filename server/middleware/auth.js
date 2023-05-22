require('dotenv').config();
const JWT = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(' ')[1];
    const decodedToken = await JWT.verify(token, jwtSecret);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ err: 'Authorization failed.' });
  }
};

const localVariables = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
};

const middlewares = {
  auth,
  localVariables,
};
module.exports = middlewares;
