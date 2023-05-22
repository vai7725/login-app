require('dotenv').config();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const otpGen = require('otp-generator');

// middlewares:
const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body;
    const userExist = await User.findOne({ username });
    if (!userExist) {
      return res
        .status(404)
        .json({ error: `No user found with the Username: ${username}` });
    }
    next();
  } catch (error) {
    return res.status(401).json({ err: 'Authentication failure.' });
  }
};

const register = async (req, res) => {
  try {
    const reqBody = req.body;
    const { username, password, profile, email } = reqBody;

    const existUsername = new Promise(async (resolve, reject) => {
      const userExist = await User.findOne({ username });
      if (userExist) {
        reject('User already exists with the username');
      }
      if (!userExist) {
        resolve('The entered username is unique');
      }
    });
    const existEmail = new Promise(async (resolve, reject) => {
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        reject('User already exists with the email');
      }
      if (!emailExist) {
        resolve('The entered email is unique');
      }
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new User({
                ...reqBody,
                password: hashedPassword,
                profile: profile || '',
              });
              user
                .save()
                .then(() =>
                  res.status(201).json({ msg: 'User registered successfully' })
                )
                .catch(() =>
                  res.status(500).json({ err: 'User could not be created' })
                );
            })
            .catch((err) =>
              res.status(500).send({ error: 'Enable to hash the password' })
            );
        }
      })
      .catch((err) => res.status(400).json({ msg: err }));
  } catch (error) {
    return res.status(500).send(error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    User.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              return res.status(400).json({ err: 'Password did not match.' });
            }

            //create JWT
            const token = JWT.sign(
              {
                userID: user._id,
                username: user.username,
              },
              jwtSecret,
              { expiresIn: '24h' }
            );

            return res.status(200).json({
              msg: 'Login successful',
              username: user.username,
              token,
            });
          })
          .catch((err) =>
            res.status(400).json({ err: 'Did not get password.' })
          );
      })
      .catch((err) => res.status(404).json({ error: err }));
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getUser = async (req, res) => {
  const { username } = req.params;
  console.log(username);
  try {
    if (!username) {
      return res.status(501).json({ err: 'Invalid username' });
    }
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          return res.status(501).json({
            err: `Couldn't find the use with the username: ${username}`,
          });
        }
        // removing password from the response and after doing that the rest is a nested object so we're converting it into json obj;
        const { password, ...rest } = Object.assign({}, user.toJSON());

        return res.status(200).json({ rest });
      })
      .catch((err) => res.status(500).json({ err }));
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { userID } = req.user;
    if (userID) {
      const body = req.body;
      console.log(body);
      User.updateOne({ _id: userID }, body)
        .then((user) => res.status(200).json({ msg: 'Records updated...' }))
        .catch((err) => res.status(500).json({ err: err }));
    }
  } catch (error) {
    return res.status(404).json({ err: 'User not found...' });
  }
};

const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGen.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).json({ code: req.app.locals.OTP });
};

const verifyOTP = async (req, res) => {
  const { code } = req.query;
  console.log(req.query);
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).json({ msg: 'Verified successfully!' });
  }
  return res.status(400).json({ err: 'Invalid OTP' });
};

const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).json({ flag: req.app.locals.resetSession });
  }
  return res.status(440).json({ err: 'Session expired' });
};
const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).json({ err: 'Session expired...' });

    const { username, password } = req.body;
    try {
      User.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              User.updateOne(
                { username: user.username },
                { password: hashedPassword }
              )
                .then((data) => {
                  req.app.locals.resetSession = false;
                  return res.status(201).json({ msg: 'Records updated...' });
                })
                .catch((error) => {
                  throw error;
                });
            })
            .catch((error) =>
              res.status(500).json({ err: 'Unable to hash password' })
            );
        })
        .catch((error) => res.status(404).json({ msg: 'User not found' }));
    } catch (error) {}
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  verifyUser,
};
