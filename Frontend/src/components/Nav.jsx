import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BlogsUserStore } from "../store/blogs-user-store";

const Nav = () => {
    const { user, setUser, api } = useContext(BlogsUserStore);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loggedOutToast = () => {
        toast.info("Logged Out Successfully!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        });
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            const response = await axios.get(`${api}/api/user/logout`);
            setUser(null);
            localStorage.removeItem("token");
            loggedOutToast();
            console.log(response.data);
            navigate("/signin");
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Request canceled", error.message);
            } else if (error.response && error.response.status === 401) {
                // Handle unauthorized access (e.g., token expired or invalid)
                setUser([]);
                navigate("/signin"); // Redirect to signin page if not authenticated
            } else {
                setError("Error fetching data");
                console.error("Error fetching data:", error);
            }
        }
    };

    return (
        <>
            <nav
                className="navbar navbar-expand-lg bg-body-tertiary bg-dark"
                data-bs-theme="dark"
            >
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        Blogify
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarNavDropdown"
                    >
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    aria-current="page"
                                    href="/"
                                >
                                    Home
                                </a>
                            </li>
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/add-new"
                                        >
                                            Add Blog
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/my-blogs"
                                        >
                                            My Blogs
                                        </Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a
                                            className="nav-link dropdown-toggle"
                                            href="#"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            {user.name}
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/signup">
                                            Create Account
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/signin">
                                            Signin
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            ;
        </>
    );
};

export default Nav;
