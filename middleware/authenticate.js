import { User } from "../models/userModel.js";
import { checkToken } from "../services/jwtServices.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1];

    const id = checkToken(token);
    const currentUser = id ? await User.findById(id) : null;

    if (id && currentUser && currentUser.token === token) {
      req.user = currentUser;
      next();
    } else
      res.status(401).json({
        message: "Unauthorized",
      });
  } catch (error) {
    next(error);
  }
};

export const authenticateRefresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const id = checkToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const currentUser = id ? await User.findById(id) : null;

    if (id && currentUser && currentUser.refreshToken === refreshToken) {
      req.user = currentUser;
      next();
    } else
      res.status(401).json({
        message: "Unauthorized",
      });
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser.admin) {
      next();
    } else
      res.status(401).json({
        message: "Unauthorized",
      });
  } catch (error) {
    next(error);
  }
};

export const isPM = async (req, res, next) => {
  try {
    const currentUser = req.user;

    if (currentUser.pm || currentUser.admin) {
      next();
    } else
      res.status(401).json({
        message: "Unauthorized",
      });
  } catch (error) {
    next(error);
  }
};
