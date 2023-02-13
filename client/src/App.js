import {
  Routes,
  Route,
  // Link,
  // useNavigate,
  // useLocation,
  // Navigate,
  // Outlet,
} from "react-router-dom";
import "./index.css";
import Landing from "./Components/Landing";
import Login from "./Components/Login";
import Container from "react-bootstrap/Container";
import NotFound from "./Components/ErrorPage";
import FieldContainer from "./Components/Container";
import Signup from "./Components/Signup";
import RequireAuth from "./Components/RequireAuth";

function App() {
  return (
    <Container id="main-container">
      <Routes id="main-container-two">
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Landing />
            </RequireAuth>
          }
        />
        <Route
          path="/signup"
          element={
            <RequireAuth>
              <Signup />
            </RequireAuth>
          }
        />
        <Route
          path="/container"
          element={
            <RequireAuth>
              <FieldContainer />
            </RequireAuth>
          }
        />
      </Routes>
    </Container>
  );
}

export default App;
