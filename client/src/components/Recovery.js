import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Username.module.css';
import { toast, Toaster } from 'react-hot-toast';
import { generateOTP, verifyOTP } from '../helper/helper';
import { userAuthStore } from '../store/store';

const Recovery = () => {
  const navigate = useNavigate();
  const { username } = userAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await verifyOTP(username, OTP);
      if (res.status === 201) {
        toast.success('OTP verified successfully!');
        return navigate('/reset');
      }
    } catch (error) {
      return toast.error('Invalid OTP!');
    }
  };

  const resendOTP = (e) => {
    e.preventDefault();
    const resendPromise = generateOTP(username);
    toast.promise(resendPromise, {
      loading: 'Sending OTP again...',
      success: <b>OTP sent successfully again!</b>,
      error: <b>Oops! Some error occured...</b>,
    });
    resendPromise.then((OTP) => {});
  };

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      if (OTP) {
        return toast.success('Otp has been sent to your email!');
      }
      return toast.error('Problem while generating otp');
    }); //getting error on importing userauthstore and will check later.
  }, [username]);
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder="none"></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Enter OTP</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter the 6 digit otp from your email
            </span>
          </div>

          <form className="py-1">
            <div className="textbox flex flex-col gap-6 items-center">
              <input
                className={styles.text_box}
                type="text"
                placeholder="OTP"
                onChange={(e) => setOTP(e.target.value)}
              />
              <button onClick={handleSubmit} className={styles.btn}>
                Recover
              </button>
            </div>
            <div className="text-center py-4">
              <span>
                Didn't get the OTP?{' '}
                <button onClick={resendOTP} className="text-red-500">
                  Resend
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Recovery;
