require("dotenv").config();
const { Router } = require("express");
const User = require("../models/user");
const {
    checkForAuthenticationCookie,
} = require("../middlewares/authentication");
const express = require("express");
const cors = require("cors");

const router = Router();
const app = express();

// const allowedOrigins = ["https://blogify-naman.netlify.app"];

// app.use(
//     cors({
//         origin: function (origin, callback) {
//             if (!origin) return callback(null, true);
//             if (allowedOrigins.indexOf(origin) === -1) {
//                 const msg =
//                     "The CORS policy for this site does not allow access from the specified Origin.";
//                 return callback(new Error(msg), false);
//             }
//             return callback(null, true);
//         },
//         credentials: true,
//     })
// );

app.use(express.json());

router.post(
    "/signin",
    checkForAuthenticationCookie("token", "home"),
    async (req, res) => {
        try {
            const { email, password } = req.body;
            const token = await User.matchPasswordAndGenerateToken(
                email,
                password
            );
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === "production",
                sameSite:
                    process.env.NODE_ENV === "production" ? "None" : "Lax",
            });
            res.status(200).json({ message: "Signin successful" });
        } catch (error) {
            console.error("Error during sign-in:", error);
            if (
                error.message === "User not found" ||
                error.message === "Incorrect password"
            ) {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }
);

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        await User.create({
            fullName,
            email,
            password,
        });

        const token = await User.matchPasswordAndGenerateToken(email, password);
        res.cookie("token", token, {
            httpOnly: true, // Helps prevent XSS attacks0
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: "Signin successful" });
    } catch (error) {
        console.error("Error during sign-in:", error);
        if (
            error.message === "User not found" ||
            error.message === "Error Cannot match Password"
        ) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
});

router.get("/logout", (req, res) => {
    // console.log("Logged out");
    res.clearCookie("token").status(200).json({ message: "Logout successful" });
});

module.exports = router;
