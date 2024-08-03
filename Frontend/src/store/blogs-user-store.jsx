import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const BlogsUserStore = createContext({
    blogs: [],
    blog: [],
    comment: [],
    user: [],
    api: "",
    setUser: [],
    loading: true,
    error: null,
    notifySuccess: () => {},
    notifyError: () => {},
    blogPage: () => {},
});

const BlogsUserStoreProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [blog, setBlog] = useState([]);
    const [comment, setComment] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const api = import.meta.env.VITE_Backend_URL;

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const token = localStorage.getItem("token");

        (async () => {
            try {
                const response = await axios.get(`${api}/api/home`, {
                    signal,
                    headers: {
                        "x-auth-token": token,
                    }
                });
                setUser(response.data.user);
                setBlogs(response.data.blogs);
                console.log("Hello");
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled", error.message);
                } else if (error.response && error.response.status === 401) {
                    setError("Error fetching data");
                    // Handle unauthorized access (e.g., token expired or invalid)
                    setUser(null);
                    navigate("/signin"); // Redirect to signin page if not authenticated
                } else {
                    setError("Error fetching data");
                    console.error("Error fetching data:", error);
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            controller.abort();
        };
    }, [navigate, location.pathname]);

    const blogPage = useCallback(
        async (address) => {
            try {
                const response = await axios.get(`${api}/api/blog/${address}`);
                setBlog(response.data.blog);
                setComment(response.data.comment);
            } catch (error) {
                if (error.message || error.message === 401) {
                    setError("Error fetching data");
                    console.error("Error fetching data:", error);
                    navigate("/");
                }
            }
        },
        [comment]
    );

    const notifySuccess = (msg) =>
        toast.success(msg, {
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

    const notifyError = (msg) =>
        toast.error(msg, {
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

    return (
        <BlogsUserStore.Provider
            value={{
                blogs,
                blog,
                comment,
                user,
                api,
                setUser,
                loading,
                error,
                notifySuccess,
                notifyError,
                blogPage,
            }}
        >
            {children}
        </BlogsUserStore.Provider>
    );
};

export default BlogsUserStoreProvider;
