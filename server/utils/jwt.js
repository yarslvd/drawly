const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const { users, tokens } = require("../models/db.js");
const db = require("../models/db.js");

const generateAccessToken = (id, username, email) => {
  const payload = {
    username,
    id,
    email,
    nanoIot: new Date().getMilliseconds(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_LIFE,
  });
};

const generateRefreshToken = (id, username, email) => {
  const payload = {
    id,
    username,
    email,
    nanoIot: new Date().getMilliseconds(),
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
  });
};

const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return {
      decoded: decoded,
      error: null,
    };
  } catch (err) {
    return {
      decoded: null,
      error: err,
    };
  }
};

async function verifyToken(access_token, refresh_token, res) {
  let decodedAccess = decodeToken(access_token);
  if (decodedAccess.error) {
    if (decodedAccess.error.message !== "jwt expired") {
      console.debug(
        `something strange with token ${decodedAccess.error.message}`
      );
      return null;
    }

    console.debug("token is expired", { access_token, refresh_token });

    let decodedRefresh = decodeToken(refresh_token);
    if (decodedRefresh.error) {
      console.debug("refresh is invalid ", decodedRefresh.error);
      return null;
    }

    let dbRefreshToken = await tokens.findByPk(refresh_token);
    if (dbRefreshToken === null) {
      console.debug("no token in db");
      return null;
    }

    let accessToken = generateAccessToken(
      decodedRefresh.decoded.id,
      decodedRefresh.decoded.username,
      decodedRefresh.decoded.email
    );
    let refreshToken = generateRefreshToken(
      decodedRefresh.decoded.id,
      decodedRefresh.decoded.username,
      decodedRefresh.decoded.email
    );

    const { exp } = decodeToken(refreshToken).decoded;
    const dbToken = await tokens.create({
      token: refreshToken,
      valid_till: exp * 1000,
    });
    if (dbToken === null) {
      console.debug("failed to create new token in db");
      return null;
    }

    //kostyl not to use it in normal project)))
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });
    decodedAccess.decoded = decodedRefresh.decoded;
  }

  let user = await users.findByPk(decodedAccess.decoded.id);
  if (user === null) {
    console.debug("no user with such id");
    return null;
  }

  return user;
}
async function jwtMiddleware(req, res, next) {
  try {
    if (
      !req.get("Authorization") &&
      !req.cookies.access_token &&
      !req.cookies.refresh_token
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "User is not authorized (empty header or cookies)",
      });
    }

    const token =
      req.get("Authorization")?.split(" ")[1] || req.cookies.access_token;

    let user = await verifyToken(token, req.cookies.refresh_token, res);
    if (user == null) {
      clearAuthCookies(res);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Token is invalid",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("jwt middleware", err);
    clearAuthCookies(res);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "User is not authorized",
    });
  }
}

function clearAuthCookies(res) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  jwtMiddleware,
  decodeToken,
};
