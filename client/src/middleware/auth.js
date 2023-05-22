import { Navigate } from 'react-router-dom';
import { userAuthStore } from '../store/store';

export const AuthorizeUser = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to={'/'} replace={true} />;
  }
  return children;
};

export const ProtectRoute = ({ children }) => {
  const username = userAuthStore.getState().auth.username;
  if (!username) {
    return <Navigate to={'/'} replace={true} />;
  }
  return children;
};
