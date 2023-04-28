function checkFields(body, fields) {
  let result = {};

  for (let i = 0; i < fields.length; i++) {
    if (body.hasOwnProperty(fields[i])) {
      result[fields[i]] = body[fields[i]];
    } else {
      result = null;
      break;
    }
  }

  return result;
}

function getDesiredFields(source, fields) {
  let result = {};

  for (let i = 0; i < fields.length; i++) {
    if (source.hasOwnProperty(fields[i])) {
      result[fields[i]] = source[fields[i]];
    }
  }

  return result;
}

module.exports = {
  checkFields,
  getDesiredFields,
};
