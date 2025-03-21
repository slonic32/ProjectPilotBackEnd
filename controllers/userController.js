import {
  loginDataService,
  logoutUserDataService,
  regenerateTokenDataService,
  addDataService,
  safeUserCloneDataService,
  updateUserUserDataService,
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
    refreshtoken: user.refreshtoken,
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

  editedUser = await updateUserUserDataService(req.user, req.body);

  res.status(200).json(safeUserCloneDataService(editedUser));
};

export const refreshTokens = async (req, res) => {
  const { token, refreshtoken } = await regenerateTokenDataService(req.user);
  res.status(200).json({ token, refreshtoken });
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
