import { toast } from 'react-hot-toast';
import { authenticate } from '../helper/helper';

// validate login page username
export const userNameValidate = async (values) => {
  const errors = userNameVerify({}, values);
  if (values.username) {
    // checking user existance
    const { status } = await authenticate(values.username);
    if (status !== 200) {
      errors.exist = toast.error('User does not exist');
    }
  }

  return errors;
};

// validate login page password
export const passwordValidate = async (values) => {
  const errors = passwordVerify({}, values);
  return errors;
};

// validate reset password
export const resetPasswordValidate = async (values) => {
  const errors = passwordVerify({}, values);
  if (values.password !== values.conf_password) {
    errors.exist = toast.error('Password did not match...');
  }
  return errors;
};

// validate register page
export const registerValidation = async (values) => {
  const errors = userNameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
};

// validate profile page
export const profileValidation = async (values) => {
  const errors = emailVerify({}, values);
  return errors;
};

// validate password
const passwordVerify = (error = {}, values) => {
  const specialCharacters = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])\S+$/;
  if (!values.password) {
    error.password = toast.error('Password required');
  } else if (values.password.includes(' ')) {
    error.password = toast.error('Invalid Password');
  } else if (values.password.length < 5) {
    error.password = toast.error('Password must have at least 5 characters.');
  } else if (!specialCharacters.test(values.password)) {
    error.password = toast.error(
      'Password must have at least one special character.'
    );
  }
  return error;
};

// validate username
const userNameVerify = (error = {}, values) => {
  if (!values.username) {
    error.username = toast.error('Username Required...!');
  } else if (values.username.includes(' ')) {
    error.username = toast.error('Invalid Username');
  }
  return error;
};

const emailVerify = (error = {}, values) => {
  const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!values.email) {
    error.email = toast.error('Email Required...');
  } else if (values.email.includes(' ')) {
    error.email = toast.error('Invalid input');
  } else if (!emailFormat.test(values.email)) {
    error.email = toast.error('Invalid email address');
  }
};
