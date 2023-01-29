import "./index.css";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Container from "react-bootstrap/Container";
import Loading from "./Components/Loading";
import NotFound from "./Components/ErrorPage";
import FieldContainer from "./Components/Container";
import Signup from "./Components/Signup";
import isLoggedIn from "./Utils/isLoggedInUtil";
import { GuardProvider, GuardedRoute } from "react-router-guards";

const requireLogin = (to, from, next) => {
  if (to.meta.requiresAuth) {
    if (isLoggedIn()) {
      next();
    }
    next.redirect("/login");
  } else {
    next();
  }
};

function App() {
  return (
    <Container id="main-container">
      <Router id="main-container-two">
        <GuardProvider
          guards={[requireLogin]}
          loading={Loading}
          error={NotFound}
        >
          <Routes>
            <GuardedRoute path="/login" exact component={Login} />
            <GuardedRoute path="/signup" exact component={Signup} />
            <GuardedRoute
              path="/"
              exact
              component={Landing}
              meta={{ requiresAuth: true }}
            />
            <GuardedRoute
              path="/container"
              exact
              component={FieldContainer}
              meta={{ requiresAuth: true }}
            />
            <GuardedRoute path="*" component={NotFound} />
          </Routes>
        </GuardProvider>
      </Router>
    </Container>
  );
}

export default App;
