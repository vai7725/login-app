const express = require('express');
const router = express.Router();
const registerMail = require('../controllers/mailer');

// importing all the controllers;
const controller = require('../controllers/appcontroller');

// importing middlewares
const middleware = require('../middleware/auth');

// POST methods
router.route('/register').post(controller.register);
router.route('/registerMail').post(registerMail);
router
  .route('/authenticate')
  .post(controller.verifyUser, (req, res) => res.end());
router.route('/login').post(controller.verifyUser, controller.login);

// GET methods
router.route('/user/:username').get(controller.getUser);
router
  .route('/generateotp')
  .get(
    controller.verifyUser,
    middleware.localVariables,
    controller.generateOTP
  );
router.route('/verifyotp').get(controller.verifyUser, controller.verifyOTP);
router.route('/createresetsession').get(controller.createResetSession);

//PUT methods
router.route('/updateuser').put(middleware.auth, controller.updateUser);
router
  .route('/resetpassword')
  .put(controller.verifyUser, controller.resetPassword);

module.exports = router;
