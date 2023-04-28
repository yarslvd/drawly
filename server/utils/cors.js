function parseWhitelist(str) {
  return str.replace('[','').replace(']','').split(', ');
}

module.exports = {
  parseWhitelist
}