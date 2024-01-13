import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import ErrorPage from './routes/errorPage';
import Login from './routes/login';
import Register from './routes/register';
import Home from './routes/home';
import NewThread from './routes/newThread';
import ThreadPage from './routes/threadPage';
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: "login", 
        element: <Login />,
      }, 
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "createThread",
        element: <NewThread />,
      },
      {
        path:":threadID",
        element:<ThreadPage/>,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
