const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName, title) {
    return (req, res, next) => {
        const tokenCookieValue = req.headers['x-auth-token'];
        console.log(tokenCookieValue);
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

        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
