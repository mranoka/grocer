const crypto = require("crypto");
const KEY = "ad778325d4af2f2092316450154eed110996fedf4b9f6688966a61bd5294c5f144937888bccbd1a04a9402ad1914b1852f02abb35bb8d60c99e641f1a3205580";
const HASH_ALGORITHM_TO_USE = crypto.getHashes().find(itemName => itemName === "sha256");

const isLoggedIn = function () {
  if (JSON.parse(sessionStorage.getItem("user"))) {
    if (
      JSON.parse(sessionStorage.getItem("user")).expiration >
      new Date().getTime() / 1000
    ) {
      let authStatusHash = crypto
        .createHash(HASH_ALGORITHM_TO_USE, KEY)
        // updating data
        .update(
          JSON.parse(sessionStorage.getItem("user")).userID)
        // Encoding to be used
        .digest("hex");
  
      return (
        JSON.parse(sessionStorage.getItem("user")).isLoggedIn === authStatusHash
      );
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default isLoggedIn;
