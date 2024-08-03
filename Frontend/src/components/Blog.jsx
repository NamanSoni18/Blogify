import { useCallback, useContext, useEffect, useRef } from "react";
import { BlogsUserStore } from "../store/blogs-user-store";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Blog = () => {
  const newComment = useRef("");
  const { user, blog, comment, blogPage, notifySuccess, notifyError, api } =
    useContext(BlogsUserStore);
  const location = useLocation();
  const address = location.pathname.split("/")[2];
  const navigate = useNavigate();

  useEffect(() => {
    blogPage(address);
  }, [address]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = newComment.current.value;

    try {
      const response = await axios.post(
        `/api/blog/comment/${blog._id}`,
        { content },
        {
          withCredentials: true,
        }
      );
      notifySuccess("Comment Created Successfully");
      blogPage(address);
    } catch (error) {
      console.log(error.response.data.message);
      notifyError(error.response.data.message);
    }
  };

  console.log(comment[1]);
  return (
    <>
      <div className="container">
        <h1>Title: {blog.title}</h1>
        <img src={blog.coverImageURL} alt="" width="700px" />
        <pre className="mt-3">Content: {blog.body}</pre>
      </div>

      <div className="container mt-4">
        Created By:
        <div className="card mb-3" style={{ maxWidth: "350px" }}>
          <div className="row g-0">
            <div className="col-md-4">
              <img
                src={blog.createdBy?.profileImageURL}
                className="img-fluid rounded-start"
                alt="..."
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h5 className="card-title">{blog.createdBy?.fullName}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <h2>Comments ({comment.length})</h2>
        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <textarea
                type="text"
                className="form-control"
                name="content"
                ref={newComment}
                placeholder="Enter your Comment"
              ></textarea>
              <button className="btn btn-sm btn-primary mt-3" type="submit">
                Add
              </button>
            </div>
          </form>
        ) : (
          <></>
        )}
        <div className="mt-3">
          {comment.length > 0 ? (
            comment.map((com, index) => (
              <div
                className="card mb-3"
                key={index}
                style={{ maxWidth: "350px" }}
              >
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={com.createdBy?.profileImageURL}
                      className="img-fluid rounded-start"
                      alt="..."
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{com.createdBy?.fullName}</h5>
                      <p className="card-text">{com.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No comments available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
