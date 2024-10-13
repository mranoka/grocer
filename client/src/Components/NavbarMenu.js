import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";



function NavbarMenu(props) {
  const navigate = useNavigate();

  let itemsList = props.oldLists.map(item => (
  <NavDropdown.Item key={item._id} value={item._id} onClick={handleListSelection}>
    {handleDateFormatting(item.listDate)}
  </NavDropdown.Item>
  ));

  function handleLogout() {
    sessionStorage.clear();
    navigate("/login");
  }

  function handleListSelection(e) {
    sessionStorage.setItem("listID", e.target.attributes.value.value);
    sessionStorage.setItem("sentinel", `777`);
    sessionStorage.setItem("mode", "0");

    navigate("/container");
  }

  function handleDateFormatting(dateString) {
    let startDate = dateString.substring(0, 10);
    let endDate = dateString.substring(13);
    var startDateObj = new Date(startDate);
    var endDateObj = new Date(endDate);
  
    var options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  
    let formattedStartDate = startDateObj.toLocaleDateString("en-GB", options);
    let formattedEndDate = endDateObj.toLocaleDateString("en-GB", options);
  
    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#"> {props.user}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '300px' }}
            navbarScroll
          >
            <Nav.Link href="#action2">Profile</Nav.Link>
            <NavDropdown title="Old Lists" id="navbarScrollingDropdown">
              {itemsList}
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