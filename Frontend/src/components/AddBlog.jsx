import { useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BlogsUserStore } from "../store/blogs-user-store";

const AddBlog = () => {
    const oldTitle = useRef("");
    const oldBody = useRef("");
    const oldCoverImage = useRef(null);
    const { notifySuccess, notifyError, api } = useContext(BlogsUserStore);

    const Navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("title", oldTitle.current.value);
        formData.append("body", oldBody.current.value);
        formData.append("coverImage", oldCoverImage.current.files[0]);
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(`${api}/api/blog`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "x-auth-token": token,
                },
            });
            // console.log(response.data);
            notifySuccess("Blog Added Successfully");
            Navigate("/");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(error.response.data.message);
                notifyError(error.response.data.message);
            }
        }
    };

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
                            id="coverImage"
                            ref={oldCoverImage}
                            aria-describedby="Image"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            id="title"
                            ref={oldTitle}
                            aria-describedby="title"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="body" className="form-label">
                            Content
                        </label>
                        <textarea
                            type="text"
                            className="form-control"
                            name="body"
                            id="body"
                            ref={oldBody}
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

export default AddBlog;
