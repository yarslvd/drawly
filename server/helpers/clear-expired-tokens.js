const { Op } = require("sequelize");

async function clearExpiredTokens(tokens) {
  await tokens.destroy({
    where: {
      valid_till: {
        [Op.lte]: Date.now()
      }
    }
  })
}

module.exports = {
  clearExpiredTokens
}