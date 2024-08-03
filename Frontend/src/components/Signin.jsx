import axios from "axios";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BlogsUserStore } from "../store/blogs-user-store";

const Signin = () => {
    const oldEmail = useRef("");
    const oldPassword = useRef("");
    const navigate = useNavigate();
    const { setUser, notifySuccess, notifyError, api } =
        useContext(BlogsUserStore);

    console.log(api);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = oldEmail.current.value;
        const password = oldPassword.current.value;
        try {
            const response = await axios.post(
                `${api}/api/user/signin`,
                {
                    email,
                    password,
                },
                {
                    withCredentials: true,
                }
            );
            console.log(response.data);
            setUser([]);
            notifySuccess("Login Successful");
            navigate("/");
        } catch (error) {
            console.error("Error signing in:", error);

            if (error.response && error.response.status === 401) {
                notifyError(error.response.data.message);
            } else {
                notifyError("Incorrect Password");
            }
        }
    };

    return (
        <>
            <div className="container mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            ref={oldEmail}
                            aria-describedby="emailHelp"
                        />
                        <div id="emailHelp" className="form-text">
                            We'll never share your email with anyone else.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            id="password"
                            ref={oldPassword}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default Signin;
