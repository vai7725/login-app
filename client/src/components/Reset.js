import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import profileImg from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { Toaster, toast } from 'react-hot-toast';
import { resetPasswordValidate } from '../helper/validate';
import { resetPassword } from '../helper/helper';
import { userAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/fetch.hook';

const Reset = () => {
  const navigate = useNavigate();
  const [{ isLoading, apiData, status, serverError }] =
    useFetch('createresetsession');
  const { username } = userAuthStore((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      password: '',
      conf_password: '',
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPromise = resetPassword({ username, password: values.password });
      toast.promise(resetPromise, {
        loading: 'Changing the password...',
        success: <b>Password changed successfully...</b>,
        error: <b>Some error occured!</b>,
      });
      resetPromise.then(() => navigate('/password'));
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return (
      <h1 className="text-2xl font-bold text-red-500">{serverError.message}</h1>
    );

  if (status && status !== 201) {
    return <Navigate to={'/password'} replace={true} />;
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder="none"></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new password
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
                placeholder="New Password"
                {...formik.getFieldProps('password')}
              />
              <input
                className={styles.text_box}
                type="text"
                placeholder="Confirm Password"
                {...formik.getFieldProps('conf_password')}
              />
              <button className={styles.btn} type="submit">
                Reset
              </button>
            </div>
            <div className="text-center py-4">
              <span>
                Forgot password?{' '}
                <Link to="/recovery" className="text-red-500">
                  Change now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
