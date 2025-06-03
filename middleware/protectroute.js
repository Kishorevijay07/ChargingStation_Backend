import jwt from "jsonwebtoken";
import User from "../model/auth.model.js";

const protectroute = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "No token found" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.secret_code);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const user = await User.findById(decoded.user_id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  req.user = user;
  next();
};

export default protectroute;
