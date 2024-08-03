require("dotenv").config();
const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");

const {
    checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(checkForAuthenticationCookie("token", "home"));

app.get("/api/home", async (req, res) => {
    const allBlog = await Blog.find({});
    return res.json({
        user: req.user,
        blogs: allBlog,
    });
});

app.use("/api/user", userRoute);
app.use("/api/blog", blogRoute);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
