import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileImg from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { passwordValidate } from '../helper/validate';
import { useFetch } from '../hooks/fetch.hook';
import { userAuthStore } from '../store/store';
import { verifyPassword } from '../helper/helper';

const Password = () => {
  const navigate = useNavigate();
  const { username } = userAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const loginPromise = verifyPassword({
        username,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: 'Verifying password...',
        success: <b>Login successfully...</b>,
        error: <b>Password did not match...</b>,
      });

      loginPromise.then((res) => {
        const { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile');
      });
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return (
      <h1 className="text-2xl font-bold text-red-500">{serverError.message}</h1>
    );

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder="none"></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">
              Welcome {apiData?.firstName || apiData?.username}
            </h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter your password
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || profileImg}
                alt="avatar"
                className={styles.profile_img}
              />
            </div>
            <div className="textbox flex flex-col gap-6 items-center">
              <input
                className={styles.text_box}
                type="text"
                placeholder="Password"
                {...formik.getFieldProps('password')}
              />
              <button className={styles.btn} type="submit">
                Sign in
              </button>
            </div>
            <div className="text-center py-4">
              <span>
                Forgot password?{' '}
                <Link to="/recovery" className="text-red-500">
                  Recover now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password;
