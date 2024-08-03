const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const cors = require("cors");
const express = require("express");
const app = express();

const {
  checkForAuthenticationCookie,
} = require("../middlewares/authentication");

app.use(cors());

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Saving Image Path
    const uploadPath = path.resolve(__dirname, "../../Frontend/public/uploads");

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    // Saving Image Path
    const uploadPath = path.resolve(__dirname, "../../Frontend/public/uploads");

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
const upload2 = multer({ storage: storage2 });

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comment = await Comment.find({
      blogId: req.params.id,
    }).populate("createdBy");
    return res.json({
      blog,
      comment,
    });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

router.post(
  "/comment/:blogId",
  checkForAuthenticationCookie("token", "blog"),
  async (req, res) => {
    try {
      const userId = req.user._id;
      await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: userId,
      });
      return res.json({ message: "Comment created successfully" });
    } catch (error) {
      if (error.message) {
        res.status(401).json({ message: error.message });
      }
    }
  }
);

router.post(
  "/",
  upload.single("coverImage"),
  checkForAuthenticationCookie("token", "blog"),
  async (req, res) => {
    const { title, body } = req.body;
    const userId = req.user._id;
    try {
      const blog = await Blog.create({
        body,
        title,
        createdBy: userId,
        coverImageURL: `/uploads/${req.file.filename}`, // Image Fetching URL
      });
      return res.status(200).json({ message: "Blog Created Successfully" });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

router.post(
  "/edit-blog/:id",
  upload2.single("coverImage"),
  checkForAuthenticationCookie("token", "blog"),
  async (req, res) => {
    const { title, body } = req.body;
    const blogId = req.params.id;
    const userId = req.user?._id;

    try {
      // Find the blog post to get the current image URL
      const blog = await Blog.findOne({ _id: blogId, createdBy: userId });

      if (!blog) {
        return res
          .status(404)
          .json({ message: "Blog not found or not authorized" });
      }

      // Delete the current image file if a new image is uploaded
      if (req.file && blog.coverImageURL) {
        const oldImagePath = path.join(
          __dirname,
          "../../Frontend/public",
          blog.coverImageURL
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error(`Failed to delete old image: ${err.message}`);
        });
      }

      // Update the blog post with the new image URL if provided
      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: blogId, createdBy: userId }, // Find the blog by ID and ensure it belongs to the current user
        {
          title,
          body,
          coverImageURL: req.file
            ? `/uploads/${req.file.filename}`
            : blog.coverImageURL,
        },
        { new: true, omitUndefined: true } // Return the updated document and ignore undefined fields
      );

      return res.status(200).json({ message: "Blog updated successfully" });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

module.exports = router;
