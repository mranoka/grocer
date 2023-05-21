import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import fetch from "isomorphic-fetch";
import Modal from "react-bootstrap/Modal";
import { Navigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import Row from "react-bootstrap/esm/Row";
import logo from "../Images/logo.png";

export default class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsArray: [],
      showModal: false,
      startDate: "",
      endDate: "",
      redirect: null,
      username: "",
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleDateSelect(event) {
    event.preventDefault();
    sessionStorage.removeItem("items");
    sessionStorage.setItem(
      "dates",
      `${this.state.startDate} - ${this.state.endDate}`
    );

    sessionStorage.setItem("sentinel", `666`);

    this.setState({
      redirect: "/container",
    });
  }

  handleStartDate(event) {
    this.setState({
      startDate: event.target.value,
    });
  }

  handleEndDate(event) {
    this.setState({
      endDate: event.target.value,
    });
  }

  handleClose() {
    this.setState({
      showModal: false,
    });
  }

  handleShow() {
    sessionStorage.setItem("mode", "1");
    this.setState({
      showModal: true,
    });
  }

  handleChange(e) {
    sessionStorage.setItem("listID", e.target.value);
    sessionStorage.setItem("sentinel", `777`);
    sessionStorage.setItem("mode", "0");

    this.setState({
      redirect: "/container",
    });
  }

  fetchUserData(userId) {
    fetch(`/items/all/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `${JSON.parse(sessionStorage.getItem("user")).userID},${
          JSON.parse(sessionStorage.getItem("user")).isLoggedIn
        }`,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        sessionStorage.setItem("userID", `${response.userId}`);
        if (response.lists.length > 0) {
          this.setState({
            itemsArray: response.lists,
          });
        } else {
          this.setState({
            itemsArray: [],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    let loggedInUserName = JSON.parse(sessionStorage.getItem("user")).user;

    this.setState({
      username: loggedInUserName.substring(0, loggedInUserName.indexOf("@")),
    });
    this.fetchUserData(JSON.parse(sessionStorage.getItem("user")).user);
  }

  handleDateFormatting(dateString) {
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

  render() {
    let items = this.state.itemsArray;
    let itemsList = items.map((item) => (
      <option key={item._id} id={item._id + "1568"} value={item._id}>
        {this.handleDateFormatting(item.listDate)}
      </option>
    ));

    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    return (
      <div>
        <Row id="landing-header">
          <span id="hamburger-menu">
            {" "}
            <GiHamburgerMenu size={40} />
          </span>
        </Row>
        <div id="landing-container" className="landing-text">
          <Row id="application-logo-container">
            <img id="application-logo" alt="application logo" src={logo} />
          </Row>
          <Row id="welcome-div" className="landing-text">
            WELCOME <br />
            {this.state.username}
          </Row>
          <Row id="landing-botons-div">
            <div id="new-list-button" className="landing-text">
              <Button
                id="login-button"
                variant="success"
                onClick={this.handleShow}
              >
                NEW LIST +
              </Button>
            </div>
            <div id="old-list-div">
              <Form.Label>Old Lists:</Form.Label>
              <Form.Select
                aria-label="Default select example"
                onChange={this.handleChange}
                value="yyyy-mm-dd"
              >
                <option defaultValue={"yyyy-mm-dd"} disabled>
                  yyyy-mm-dd
                </option>
                {itemsList}
              </Form.Select>
            </div>
          </Row>

          <Modal show={this.state.showModal} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Select Dates</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={this.handleDateSelect}>
                <Form.Group className="mb-3" controlId="formBasicStart">
                  <Form.Label>Starts:</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={this.state.startDate}
                    onChange={this.handleStartDate}
                  />
                  <Form.Text className="text-muted"></Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEnd">
                  <Form.Label>Ends:</Form.Label>
                  <Form.Control
                    type="date"
                    value={this.state.endDate}
                    onChange={this.handleEndDate}
                  />
                </Form.Group>
                <a href="/container">
                  <Button variant="primary" type="submit">
                    Add
                  </Button>
                </a>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}
