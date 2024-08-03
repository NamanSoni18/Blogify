import axios from "axios";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BlogsUserStore } from "../store/blogs-user-store";

const Signup = () => {
  const oldEmail = useRef("");
  const oldPassword = useRef("");
  const oldName = useRef("");
  const Navigate = useNavigate();

  const {notifySuccess, api} = useContext(BlogsUserStore);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fullName = oldName.current.value;
    const email = oldEmail.current.value;
    const password = oldPassword.current.value;
    try {
      const response = await axios.post(
        `/api/user/signup`,
        {
          fullName,
          email,
          password,
        },
        {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      notifySuccess("Account Created Successfully");
      Navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };
  
  return (
    <>
      <div className="container mt-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="name"
              className="form-control"
              name="name"
              id="name"
              ref={oldName}
              aria-describedby="nameHelp"
            />
          </div>
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

export default Signup;
