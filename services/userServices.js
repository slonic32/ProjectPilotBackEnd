import bcrypt from "bcrypt";

import { User } from "../models/userModel.js";
import HttpError from "../helpers/HttpError.js";
import { generateTokens } from "./jwtServices.js";
import { isValidObjectId } from "mongoose";

export const addDataService = async (
  email,
  name,
  phone,
  password,
  admin,
  pm
) => {
  if ((await User.findOne({ email })) !== null) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    email,
    name,
    phone,
    password: hashedPassword,
    admin,
    pm,
  });
  return newUser;
};

export const loginDataService = async (email, password) => {
  const foundUser = await User.findOne({ email });
  if (!foundUser) throw HttpError(401, "Email or password is wrong");

  const isPasswordMatching = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatching) throw HttpError(401, "Email or password is wrong");

  return await generateTokens(foundUser);
};

export const logoutUserDataService = async (currentUser) => {
  await User.findByIdAndUpdate(
    { _id: currentUser._id },
    { token: null, refreshToken: null }
  );
};

export const updateUserDataService = async (currentUser, newData) => {
  if (!currentUser) throw HttpError(401, "User not found");
  if (newData.password) {
    newData.password = await bcrypt.hash(password, 10);
  }
  try {
    return await User.findByIdAndUpdate(currentUser._id, newData, {
      new: true,
    });
  } catch (error) {
    throw HttpError(501, error);
  }
};

export const regenerateTokenDataService = async (currentUser) => {
  if (!currentUser) throw HttpError(401, "User is not found");
  return await generateTokens(currentUser);
};

export const safeUserCloneDataService = (user) => {
  const { token, refreshToken, password, ...cloneUser } = user.toObject();
  return cloneUser;
};

export const allUserDataService = async () => {
  const users = await User.find();
  return users;
};

export const deleteUserDataService = async (id, currentUser) => {
  try {
    const isValid = isValidObjectId(id);

    if (!isValid) {
      throw HttpError(404, "User not found");
    }

    if (id === currentUser.id) {
      throw HttpError(409, "Can't delete current user!");
    }

    const deletedData = await User.findByIdAndDelete(id);

    if (!deletedData) {
      throw HttpError(404, "User not found");
    }

    return deletedData;
  } catch (error) {
    throw error;
  }
};

export const editUserDataService = async (id, newData, currentUser) => {
  try {
    const isValid = isValidObjectId(id);

    if (!isValid) {
      throw HttpError(404, "User not found");
    }

    if (id === currentUser.id) {
      throw HttpError(409, "Can't edit current user!");
    }
    if (newData.password) {
      newData.password = await bcrypt.hash(password, 10);
    }

    return await User.findByIdAndUpdate(id, newData, {
      new: true,
    });
  } catch (error) {
    throw HttpError(501, error);
  }
};
