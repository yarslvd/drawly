const { tokens, users } = require("../models/db");
const { StatusCodes } = require("http-status-codes");
const { decodeToken } = require("../utils/jwt");

async function getUserByToken(token, res) {
  const dbToken = await tokens.findByPk(token);
  console.log(dbToken);

  if (dbToken === null) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: "No such token",
    });
    return null;
  }

  let decodedToken = await decodeToken(dbToken.token);

  let user = users.findByPk(decodedToken.id);

  if (user === null) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: "No such user",
    });
    return null;
  }

  return user;
}

module.exports = {
  getUserByToken,
};
