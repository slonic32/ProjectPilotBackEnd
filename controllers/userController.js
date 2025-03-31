import {
  loginDataService,
  logoutUserDataService,
  regenerateTokenDataService,
  addDataService,
  safeUserCloneDataService,
  updateUserDataService,
  allUserDataService,
  deleteUserDataService,
} from "../services/userServices.js";

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

export const updateUser = async (req, res, next) => {
  let editedUser = {};
  const user = req.user;
  const { email, name, phone, password, admin, pm } = req.body;

  editedUser = await updateUserDataService(
    user,
    email,
    name,
    phone,
    password,
    admin,
    pm
  );

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
