import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// importing all the route components;
import PageNotFound from './components/PageNotFound';
import Password from './components/Password';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Register from './components/Register';
import Reset from './components/Reset';
import UserName from './components/UserName';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <UserName />,
    },
    {
      path: '/password',
      element: <Password />,
    },
    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '/recovery',
      element: <Recovery />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/reset',
      element: <Reset />,
    },
    {
      path: '*',
      element: <PageNotFound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
