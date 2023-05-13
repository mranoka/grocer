const crypto = require("crypto");
const KEY = "mayTheForceBeWithYouTheySaid";
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
