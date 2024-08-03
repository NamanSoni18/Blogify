import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AnonymousMyBlogs from "./components/Home.jsx";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import AddBlog from "./components/AddBlog.jsx";
import Blog from "./components/Blog.jsx";
import EditBlog from "./components/EditBlog.jsx";
import MyBlogs from "./components/MyBlogs.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <>
            <AnonymousMyBlogs />
          </>
        ),
      },
      {
        path: "/signin",
        element: (
          <>
            <Signin />
          </>
        ),
      },
      {
        path: "/signup",
        element: (
          <>
            <Signup />,
          </>
        ),
      },
      {
        path: "/add-new",
        element: (
          <>
            <AddBlog />,
          </>
        ),
      },
      {
        path: "/my-blogs",
        element: (
          <>
            <MyBlogs />,
          </>
        ),
      },
      {
        path: "/blog/:id",
        element: (
          <>
            <Blog />
          </>
        ),
      },
      {
        path: "/edit-blog/:id",
        element: (
          <>
            <EditBlog />
          </>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
