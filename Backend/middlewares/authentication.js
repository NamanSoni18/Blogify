const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName, title) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            if (title === "home") {
                return next();
            } else if (title === "blog") {
                // console.log("Hello");
                return res.status(401).json({ message: "Unauthorized access" });
            }
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Set CORS headers dynamically
        const allowedOrigins = ["https://blogify-naman.netlify.app"];
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.header("Access-Control-Allow-Origin", origin);
        }

        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept"
        );

        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
