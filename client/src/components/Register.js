import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileImg from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import convertToBase64 from '../helper/convert';
import { registerValidation } from '../helper/validate';
import { registerUser } from '../helper/helper';

const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '' });
      const registerPromise = registerUser(values);
      console.log(registerPromise);
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>User registered successfully...</b>,
        error: <b>Some error occured...</b>,
      });
      registerPromise.then(() => navigate('/'));
    },
  });

  const onSubmitFile = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder="none"></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || profileImg}
                  alt="avatar"
                  className={styles.profile_img}
                />
              </label>
              <input
                type="file"
                onChange={onSubmitFile}
                className={styles.fileTypeInput}
                id="profile"
              />
            </div>
            <div className="textbox flex flex-col gap-6 items-center">
              <input
                className={styles.text_box}
                type="text"
                placeholder="Email"
                {...formik.getFieldProps('email')}
              />
              <input
                className={styles.text_box}
                type="text"
                placeholder="Username"
                {...formik.getFieldProps('username')}
              />
              <input
                className={styles.text_box}
                type="text"
                placeholder="Password"
                {...formik.getFieldProps('password')}
              />
              <button className={styles.btn} type="submit">
                Register
              </button>
            </div>
            <div className="text-center py-4">
              <span>
                Already registered?{' '}
                <Link to="/" className="text-red-500">
                  Log in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
