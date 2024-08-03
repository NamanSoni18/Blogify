import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Outlet } from "react-router-dom";
import Nav from "./components/Nav";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import BlogsUserStoreProvider from "./store/blogs-user-store";

function App() {
  return (
    <>
      <BlogsUserStoreProvider>
        <Nav/>
        <Outlet />
        <ToastContainer />
      </BlogsUserStoreProvider>
    </>
  );
}

export default App;
