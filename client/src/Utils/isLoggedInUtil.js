const isLoggedIn = function () {
  if (JSON.parse(sessionStorage.getItem("user"))) {
    if (
      JSON.parse(sessionStorage.getItem("user")).expiration >
      new Date().getTime() / 1000
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export default isLoggedIn;
