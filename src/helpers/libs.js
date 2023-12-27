const crypto = require("crypto");

const helpers = {};

helpers.randomNumber = () => {
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomNumber = 0;

  for (let i = 0; i < 6; i++) {
    randomNumber += possible.charAt(crypto.randomInt(0, possible.length));
  }

  return randomNumber;
};

module.exports = helpers;
