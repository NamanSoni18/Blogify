import { useContext, useEffect, useRef, useState } from "react";
import { BlogsUserStore } from "../store/blogs-user-store";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./EditBlog.module.css";
import axios from "axios";

const EditBlog = () => {
  const { blog, blogPage, notifySuccess, notifyError, api } =
    useContext(BlogsUserStore);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const address = location.pathname.split("/")[2];

  useEffect(() => {
    blogPage(address);
  }, [address]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setBody(blog.body || "");
    }
  }, [blog]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("coverImage", coverImage);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${api}/api/blog/edit-blog/${address}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": token,
          },
        }
      );

      console.log(response.data);
      notifySuccess("Blog Edited Successfully");
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        notifyError(error.response.data.message);
        navigate("/signin");
      } else {
        // Handle other errors
        console.error(error);
      }
    }
  };

  console.log(blog);
  return (
    <>
      <div className="container mt-3">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="coverImage" className="form-label">
              Cover Image
            </label>
            <input
              type="file"
              className="form-control"
              name="coverImage"
              onChange={(e) => setCoverImage(e.target.files[0])}
              id="coverImage"
              aria-describedby="Image"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <textarea
              type="text"
              className="form-control"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-describedby="title"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="body" className="form-label">
              Content
            </label>
            <textarea
              type="text"
              className={`form-control ${styles.editBody}`}
              name="body"
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Leave a comment here"
              aria-describedby="body"
            ></textarea>
          </div>
          <div className="mb-3">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditBlog;
