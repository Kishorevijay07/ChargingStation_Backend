import jwt from "jsonwebtoken";

const generatetoken = (userId, res) => {
  const token = jwt.sign({ user_id: userId }, process.env.secret_code, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
  httpOnly: true,
  secure: true,           // Required for cross-site cookies (and Render uses HTTPS)
  sameSite: "None",       // Required for cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
};

export default generatetoken;
