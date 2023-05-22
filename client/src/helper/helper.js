import axios from 'axios';
import jwtDecode from 'jwt-decode';
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// get username from the token
export const getUsernameFromToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return Promise.reject("Couldn't find the token");
  }
  const decode = jwtDecode(token);
  return decode;
};

// authenticate function.
export const authenticate = async (username) => {
  try {
    const data = await axios.post('/api/authenticate', { username });
    return data;
  } catch (error) {
    return { error: 'Username does not exist...' };
  }
};

// get user details
export const getUser = async ({ username }) => {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Password didn't match" };
  }
};

// register user function
export const registerUser = async (credentials) => {
  try {
    const { data, status } = await axios.post('/api/register', credentials);
    console.log(status);
    const { username, email } = credentials;
    // send email
    if (status === 201) {
      await axios.post('/api/registermail', {
        username,
        userEmail: email,
        text: data.msg,
      });
    }
    return Promise.resolve(data.msg);
  } catch (error) {
    return Promise.reject({ error });
  }
};

// login function
export const verifyPassword = async ({ username, password }) => {
  try {
    if (username) {
      const { data } = await axios.post('/api/login', {
        username,
        password,
      });

      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
};

// update user function
export const updateUser = async (response) => {
  try {
    console.log(response);
    const token = await localStorage.getItem('token');
    const data = await axios.put('/api/updateuser', response, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't update profile..." });
  }
};

//generate otp
export const generateOTP = async (username) => {
  try {
    const { data, status } = await axios.get('/api/generateotp', {
      params: { username },
    });
    if (status === 201) {
      const {
        data: { rest },
      } = await getUser({ username });

      const text = `Your password recovery OTP is ${data.code}. Verify and recover your password.`;
      await axios.post('/api/registerMail', {
        username,
        userEmail: rest.email,
        text,
        subject: 'Password recovery OTP',
      });
      return Promise.resolve(data.code);
    }
  } catch (error) {
    return Promise.reject({ error });
  }
};

// verify OTP
export const verifyOTP = async (username, code) => {
  try {
    const { data, status } = await axios.get('/api/verifyotp', {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
};

// reset password
export const resetPassword = async ({ username, password }) => {
  console.log(username, password);
  try {
    const { data, status } = await axios.put('/api/resetpassword', {
      username,
      password,
    });
    console.log(data, status);
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
};
