import jwt from "jsonwebtoken";

const generatetoken = (userId, res) => {
  const token = jwt.sign({ user_id: userId }, process.env.secret_code, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // set to true in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export default generatetoken;
