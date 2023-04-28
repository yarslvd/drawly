const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const db = require("../models/db");

const { ImgurClient } = require("imgur");
const { getDesiredFields } = require("../helpers/object-fields");
const { hashPassword } = require("../utils/bcrypt");
const { processPagination } = require("../helpers/db-helper");
const { createUrlParams } = require("../helpers/url-helpers");

const imgurClient = new ImgurClient({ clientId: process.env.IMGUR_ID });

const getOne = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await db.users.findByPk(userId, {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "username",
        "birthdate",
        "email",
        "image",
      ],
    });
    if (user === null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "No user with id " + eventId,
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.log("Some error while getting user: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while getting user: " + error.message,
    });
  }
};

const getMe = (req, res) => {
  req.params.id = req.user.id;
  getOne(req, res);
  return;
};

const update = async (req, res) => {
  try {
    const userId = req.user.id;

    let toUpdate = getDesiredFields(req.body, [
      "username",
      "first_name",
      "last_name",
      "birthdate",
      "password",
    ]);

    if (toUpdate.password) {
      toUpdate.password = hashPassword(toUpdate.password);
    }

    if (toUpdate.username) {
      let user = await db.users.findOne({
        where: { username: toUpdate.username },
      });
      if (user !== null) {
        return res.status(StatusCodes.CONFLICT).json({
          error: "This username is already taken",
        });
      }
    }

    await db.users.update(toUpdate, { where: { id: userId }, plain: true });

    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.log("Some error while updating user: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while updating user: " + error.message,
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    console.log(req);
    const tempPath = req.file.path;
    const targetPath = path.join(
      __dirname,
      "../public/avatars/" + req.user.id + path.extname(req.file.originalname)
    );

    fs.renameSync(tempPath, targetPath);

    const response = await imgurClient.upload({
      image: fs.createReadStream(targetPath),
      type: "stream",
    });
    console.log(response.data);

    await db.users.update(
      { image: response.data.link },
      { where: { id: req.user.id }, plain: true }
    );

    res.sendStatus(StatusCodes.OK);
  } catch (error) {
    console.log("Some error while updating user avatar: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while updating user avatar: " + error.message,
    });
  }
};

module.exports = {
  getOne,
  getMe,
  update,
  updateAvatar,
};
