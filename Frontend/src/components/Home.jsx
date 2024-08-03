import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BlogsUserStore } from "../store/blogs-user-store";

const Home = () => {
  const { blogs, api, loading, error, user } = useContext(BlogsUserStore);

  // console.log(user);
  // console.log(blogs);
  console.log(api);
  return (
    <div className="container mt-3">
      <div className="row row-cols-4">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div className="col" key={blog._id}>
              <div className="card m-4" style={{ width: "18rem" }}>
                <img
                  src={blog.coverImageURL}
                  className="card-img-top"
                  alt={blog.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <Link to={`/blog/${blog._id}`} className="btn btn-primary">
                    View
                  </Link>
                  {user?._id === blog?.createdBy && (
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="btn ms-2 btn-secondary"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No blogs available</div>
        )}
      </div>
    </div>
  );
};

const AnonymousMyBlogs = (() => {
  return (props) => <Home {...props} />;
})();

export default AnonymousMyBlogs;
