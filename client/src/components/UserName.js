import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileImg from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { Toaster } from 'react-hot-toast';
import { userNameValidate } from '../helper/validate';
import { userAuthStore } from '../store/store';

const UserName = () => {
  const navigate = useNavigate();

  const setUsername = userAuthStore((state) => state.setUsername);

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validate: userNameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username);
      navigate('/password');
    },
  });
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder="none"></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Welcome User!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter the username
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={profileImg}
                alt="avatar"
                className={styles.profile_img}
              />
            </div>
            <div className="textbox flex flex-col gap-6 items-center">
              <input
                className={styles.text_box}
                type="text"
                placeholder="Username"
                {...formik.getFieldProps('username')}
              />
              <button className={styles.btn} type="submit">
                Let's go
              </button>
            </div>
            <div className="text-center py-4">
              <span>
                Not a member{' '}
                <Link to="/register" className="text-red-500">
                  Register
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserName;
