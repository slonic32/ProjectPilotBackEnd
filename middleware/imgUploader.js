import multer from "multer";
import { v4 } from "uuid";
import HttpError from "../helpers/HttpError.js";
import * as fse from "fs-extra";

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    await fse.ensureDir("tmp");
    cb(null, "tmp");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${req.user.id}-${v4()}.${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(HttpError(400, "Please, upload images only.."), false);
  }
}

const fileLimits = {
  fieldSize: 1000000,
};

export const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: fileLimits,
}).single("avatar");
