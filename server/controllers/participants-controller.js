const { checkFields, getDesiredFields } = require("../helpers/object-fields");
const { checkIsParticipant } = require("../helpers/check-participant");
const { StatusCodes } = require("http-status-codes");
const db = require("../models/db");
const create = async (req, res) => {
  try {
    const request = checkFields(req.body, ["user_id", "canvas_id"]);
    if (!request) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Some fields are missed",
      });
    }

    let isHere = await checkIsParticipant(
      db.participants,
      req.user.id,
      request.canvas_id
    );
    if (!isHere) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "You are not a participant in canvas",
      });
    }

    isHere = await checkIsParticipant(
      db.participants,
      request.user_id,
      request.canvas_id
    );
    if (isHere) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "User is already a participant in canvas",
      });
    }

    const participant = await db.participants.create({
      user_id: request.user_id,
      canvas_id: request.canvas_id,
    });

    return res.json({
      participant,
    });
  } catch (error) {
    console.log("Some error while creating participant: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while creating participant: " + error.message,
    });
  }
};

const getParticipants = async (req, res) => {
  try {
    let filters = getDesiredFields(req.query, ["user_id", "canvas_id"]);

    if (!filters.canvas_id && !filters.user_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Some fields are missed",
      });
    }

    let where = { where: {} };
    if (filters.user_id) {
      where.where.user_id = filters.user_id;
    }
    if (filters.canvas_id) {
      where.where.canvas_id = filters.canvas_id;
    }

    const participants = await db.participants.findAll({
      attributes: [],
      ...where,
      include: [
        {
          model: db.users,
          as: "user",
          attributes: ["id", "first_name", "last_name", "username", "email"],
        },
        {
          model: db.canvases,
          as: "canvas",
          attributes: ["id", "title", "content"],
        },
      ],
    });

    return res.status(StatusCodes.OK).json({
      participants,
    });
  } catch (error) {
    console.log("Some error while getting participants: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while getting participants: " + error.message,
    });
  }
};

const deleteParticipant = async (req, res) => {
  try {
    const request = checkFields(req.body, ["user_id", "canvas_id"]);
    if (!request) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Some fields are missed",
      });
    }

    let isHere = await checkIsParticipant(
      db.participants,
      req.user.id,
      request.canvas_id
    );
    if (!isHere) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "You are not a participant in canvas",
      });
    }

    let participant = await db.participants.findOne({
      where: {
        user_id: request.user_id,
        canvas_id: request.canvas_id,
      },
    });

    if (!participant) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "No such participant",
      });
    }

    await participant.destroy();

    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.log("Some error while deleting participant: ", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Some error while deleting participant: " + error.message,
    });
  }
};

module.exports = {
  get: getParticipants,
  create,
  delete: deleteParticipant,
};
