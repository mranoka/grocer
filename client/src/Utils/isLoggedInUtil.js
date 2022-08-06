const isLoggedIn = function () {
  if (JSON.parse(sessionStorage.getItem("user"))) {
    if (
      JSON.parse(sessionStorage.getItem("user")).expiration >
      new Date().getTime() / 1000
    ) {
      return JSON.parse(sessionStorage.getItem("user")).isLoggedIn;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// const isLoggedIn = function() {
// return false;
// }

export default isLoggedIn;
