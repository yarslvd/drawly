const {tokens} = require("../models/db");
const {StatusCodes} = require("http-status-codes");
const { decodeToken } = require("../utils/jwt");


async function createToken(token, res) {
    const {exp} = decodeToken(token).decoded;

    const [, isTokenCreated] = await tokens.findOrCreate({
        where: { token:token },
        defaults : {
            token: token,
            valid_till: exp * 1000
        },
    })

    if (!isTokenCreated) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error : `Something strange happened`,
        });
        return null
    }

    return token
}

module.exports = {
    createToken,
}