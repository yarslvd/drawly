const { checkFields, getDesiredFields } = require("../helpers/object-fields");
const { StatusCodes } = require("http-status-codes");
const db = require("../models/db");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    // console.log(req.body);
    const request = checkFields(req.body, ["title", "content", "preview"]);
    if (!request) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Some fields are missed",
      });
    }

    const canvas = await db.canvases.create({
      id: uuidv4(),
      title: request.title,
      content: request.content,
      preview: request.preview,
    });

    const participant = await db.participants.create({
      user_id: req.user.id,
      canvas_id: canvas.id,
    });

    return res.json({
      canvas,
    });
  } catch (error) {
    console.log("Some error while creating canvas: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while creating canvas: " + error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    console.log("update");
    const request = checkFields(req.body, [
      "id",
      "title",
      "content",
      "preview",
    ]);
    if (!request) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Some fields are missed",
      });
    }

    let canvas = await db.canvases.findOne({
      where: { id: request.id },
    });

    if (!canvas) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "No canvas with such id",
      });
    }
    canvas.content = request.content;
    canvas.title = request.title;
    canvas.preview = request.preview;
    await canvas.save();

    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.log("Some error while updating canvas: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while updating canvas: " + error.message,
    });
  }
};

const getList = async (req, res) => {
  try {
    const canvases = await db.canvases.findAll({
      include: {
        model: db.participants,
        as: "participants",
        where: {
          user_id: req.user.id,
        },
      },
      attributes: ["id", "title", "preview"],
    });

    return res.status(StatusCodes.OK).json({
      canvases,
    });
  } catch (error) {
    console.log("Some error while getting canvases: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while getting canvases: " + error.message,
    });
  }
};

const getCanvas = async (req, res) => {
  try {
    const canvasUUID = req.params.id;

    const canvases = await db.canvases.findByPk(canvasUUID);

    return res.status(StatusCodes.OK).json({
      canvases,
    });
  } catch (error) {
    console.log("Some error while getting canvases: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while getting canvases: " + error.message,
    });
  }
};

const getFirstCanvas = async (req, res) => {
  try {
    const canvases = await db.canvases.findOne({
      include: {
        model: db.participants,
        as: "participants",
        where: {
          user_id: req.user.id,
        },
      },
      attributes: ["id", "title", "content"],
      order: [["id", "ASC"]],
      limit: 1,
    });

    return res.status(StatusCodes.OK).json({
      canvases,
    });
  } catch (error) {
    console.log("Some error while getting canvases: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while getting canvases: " + error.message,
    });
  }
};

const deleteCanvas = async (req, res) => {
  try {
    const request = checkFields(req.body, ["id"]);
    if (!request) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Some fields are missed",
      });
    }

    let canvas = await db.canvases.findOne({
      where: { id: request.id },
    });

    if (!canvas) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "No canvas with such id",
      });
    }

    await canvas.destroy();

    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.log("Some error while deleting canvas: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while deleting canvas: " + error.message,
    });
  }
};

module.exports = {
  getList,
  getFirstCanvas,
  get: getCanvas,
  update,
  create,
  delete: deleteCanvas,
};
