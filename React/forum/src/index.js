import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AddUser from './pages/AddUser.tsx';
import Home from './pages/Home.tsx';
import NotFound from './pages/NotFound.tsx';
import GetTopics from './pages/GetTopics.tsx';
import AddTopic from './pages/AddTopic.tsx';
import GetMessages from './pages/GetMessages.tsx';


const router = createBrowserRouter([
  {
  path:'/', 
  element: <Home />,
  errorElement: <NotFound />
  },
  {
    path:'/addUser', 
    element: <AddUser />
  },
  {
    path:'/addTopic', 
    element: <AddTopic />
  },
  {
    path:'/getTopics', 
    element: <GetTopics />
  },
  {
    path:'/getTopics/:id/getMessages', 
    element: <GetMessages />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
