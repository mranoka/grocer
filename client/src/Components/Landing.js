import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import fetch from "isomorphic-fetch";
import Modal from "react-bootstrap/Modal";
// import FieldContainer from "./Container";
import { Redirect } from "react-router-dom";

export default class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsArray: [],
      showModal: false,
      startDate: "",
      endDate: "",
      redirect: null,
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

  handleChange() {
    sessionStorage.setItem("mode", "0");
  }

  fetchData() {
    fetch("/items/all")
      .then((res) => res.json())
      .then(
        (response) => {
          this.setState({
            itemsArray: response.items,
          });
        },
        (err) => console.log(err)
      );
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    let items = this.state.itemsArray;
    let itemsList = items.map((item) => (
      <option id={item._id + "1568"} value={item._id}>
        {item.listDate}
      </option>
    ));

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <div id="landing-container" className="landing-text">
        <div id="welcome-div" className="landing-text">
          WELCOME
        </div>
        <div id="landing-botons-div">
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
            >
              <option selected disabled value="">
                yyyy-mm-dd
              </option>
              {itemsList}
            </Form.Select>
          </div>
        </div>

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
    );
  }
}
