const { clearExpiredTokens } = require("../helpers/clear-expired-tokens");

function startTokensCleaner(tokens) {
  setInterval(() => {
    clearExpiredTokens(tokens);
  }, 60 * 1000);
}

module.exports = {
  startTokensCleaner
}