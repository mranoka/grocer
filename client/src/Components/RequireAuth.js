import { useNavigate } from "react-router-dom";
import isLoggedIn from "../Utils/isLoggedInUtil";
import { useEffect } from "react";

function RequireAuth({ children }) {
  let auth = isLoggedIn();
  const navigate = useNavigate();

  useEffect(()=> {
    if (!auth) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return navigate("/login");
      }
  },[])

  return children;
}

export default RequireAuth;
