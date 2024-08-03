const jwt = require("jsonwebtoken");

const secret = "$uperMan@123";
function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.fullName,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  console.log(payload);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
