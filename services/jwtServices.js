import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/userModel.js";

export const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "1d",
  });

export const checkToken = (token, secret = process.env.SECRET) => {
  if (!token) throw HttpError(401, "Unauthorized");

  try {
    const { id } = jwt.verify(token, secret);
    return id;
  } catch (error) {
    throw HttpError(401, "Unauthorized");
  }
};

export const generateTokens = async (user) => {
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: process.env.AUTH_EXPIRATION || '1d'
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '30d',
  });

  return await User.findByIdAndUpdate(
    user.id,
    { token, refreshToken },
    { new: true }
  );
};
