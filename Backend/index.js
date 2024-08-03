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

const allowedOrigins = ['https://blogify-naman.netlify.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

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

app.get(
  "/api/home",
  checkForAuthenticationCookie("token", "home"),
  async (req, res) => {
    const allBlog = await Blog.find({});
    return res.json({
      user: req.user,
      blogs: allBlog,
    });
    // return res.render("home", {
    //   user: req.user,
    //   blogs: allBlog,
    // })
  }
);

app.use("/api/user", userRoute);
app.use("/api/blog", blogRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
