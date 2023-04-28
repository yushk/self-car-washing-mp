let devEnv = require("./dev.env.js").result;
let testEnv = require("./test.env.js").result;
let prodEnv = require("./prod.env.js").result;
let result = {};
console.log("config.index process.env.NODE_ENV", process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
  case "development":
    result = devEnv;
    break;
  case "test":
    result = testEnv;
    break;
  case "production":
    result = prodEnv;
    break;
  default:
    result = prodEnv;
}

module.exports = {
  result,
};
