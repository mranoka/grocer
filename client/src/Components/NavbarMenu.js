import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Navigate } from "react-router-dom";

function NavbarMenu(props) {

  function handleLogout() {
    console.log("redirection")
    document.reload()
      return <Navigate to="/login" />;
  }

  return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Welcome {props.user}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '300px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">New List +</Nav.Link>
            <Nav.Link href="#action2">Profile</Nav.Link>
            <NavDropdown title="Old Lists" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default NavbarMenu;