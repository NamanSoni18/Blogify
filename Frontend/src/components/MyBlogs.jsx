import { useContext } from "react";
import { Link } from "react-router-dom";
import { BlogsUserStore } from "../store/blogs-user-store";

const MyBlogs = () => {
  const { blogs, loading, error, user } = useContext(BlogsUserStore);

  console.log(blogs);
  console.log(user);
  return (
    <>
      <div className="container mt-3">
        <div className="row row-cols-4">
          {blogs
            .filter((blog) => blog.createdBy === user?._id) 
            .map((blog) => (
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
                    <Link
                      to={`/edit-blog/${blog._id}`}
                      className="btn ms-2 btn-secondary"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MyBlogs;
