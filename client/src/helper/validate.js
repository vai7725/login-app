import { toast } from 'react-hot-toast';

// validate login page username
export const userNameValidate = async (values) => {
  const errors = userNameVerify({}, values);
  return errors;
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
