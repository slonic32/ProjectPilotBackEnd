import {
  loginDataService,
  logoutUserDataService,
  regenerateTokenDataService,
  addDataService,
  safeUserCloneDataService,
  updateUserDataService,
  allUserDataService,
  deleteUserDataService,
  editUserDataService,
} from "../services/userServices.js";

import { resizeImg } from "../services/imgServices.js";

export const add = async (req, res) => {
  const { email, name, phone, password, admin, pm } = req.body;
  const newUser = await addDataService(email, name, phone, password, admin, pm);

  res.status(200).json({
    user: safeUserCloneDataService(newUser),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await loginDataService(email, password);

  res.status(200).json({
    user: safeUserCloneDataService(user),
    token: user.token,
    refreshToken: user.refreshToken,
  });
};

export const logout = async (req, res) => {
  await logoutUserDataService(req.user);
  res.status(204).json();
};

export const current = async (req, res) => {
  res.status(200).json({ user: safeUserCloneDataService(req.user) });
};

function removeEmptyProps(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export const updateUser = async (req, res) => {
  let editedUser = {};
  const user = req.user;
  const dirtyData = req.body;
  const clearData = removeEmptyProps(dirtyData);

  if (req.file) {
    const avatarURL = await resizeImg(req.file);
    editedUser = await updateUserDataService(user, {
      ...clearData,
      avatarURL,
    });
  } else {
    editedUser = await updateUserDataService(user, {
      ...clearData,
    });
  }

  res.status(200).json({ user: safeUserCloneDataService(editedUser) });
};

export const refreshTokens = async (req, res) => {
  const { token, refreshToken } = await regenerateTokenDataService(req.user);
  res.status(200).json({ token, refreshToken });
};

export const all = async (req, res) => {
  const users = await allUserDataService();
  res
    .status(200)
    .json({ users: users.map((user) => safeUserCloneDataService(user)) });
};

export const deleteUser = async (req, res) => {
  const deletedData = await deleteUserDataService(req.params.id, req.user);

  res.status(200).json({
    user: safeUserCloneDataService(deletedData),
    message: "User was deleted",
  });
};

export const editUser = async (req, res) => {
  const id = req.params.id;
  const currentUser = req.user;
  const dirtyData = req.body;
  const clearData = removeEmptyProps(dirtyData);

  const editedUser = await editUserDataService(
    id,
    {
      ...clearData,
    },
    currentUser
  );

  res.status(200).json({ user: safeUserCloneDataService(editedUser) });
};
