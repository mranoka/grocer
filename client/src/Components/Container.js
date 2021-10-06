import React from "react";
import Header from "./Header";
import Items from "./Items";
import NewItem from "./NewItem";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import fetch from "isomorphic-fetch";
import Modal from "react-bootstrap/Modal";
import "../index.css";

export default class FieldContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemsArray: [],
      savedItemsArray: [],
      showModal: false,
      dates: "",
      mode: "",
      listID: "",
      responseHolder: "",
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  startList() {
    fetch("/new/item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dates: sessionStorage.getItem("dates"),
        items: [],
      }),
    })
      .then((res) => res.json())
      .then(
        (response) => {
          this.setState({
            listID: response.data,
          });
          sessionStorage.setItem("listID", `${response.data}`);
        },
        (err) => console.log(err)
      );
  }

  updateList() {
    fetch(
      `/items/month/${
        this.state.listID ? this.state.listID : sessionStorage.getItem("listID")
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON?.stringify({
          items: [...JSON?.parse(sessionStorage.getItem("items"))],
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (response) => {
          this.setState({
            responseHolder: response,
          });
        },
        (err) => console.log(err)
      );
  }

  fetchData() {
    fetch("/items/all")
      .then((res) => res.json())
      .then(
        (response) => {
          this.setState({
            savedItemsArray: response.items[0].items,
          });
        },
        (err) => console.log(err)
      );
  }

  componentDidMount() {
    this.setState({
      dates: sessionStorage.getItem("dates"),
      mode: sessionStorage.getItem("mode"),
      itemsArray: JSON.parse(sessionStorage.getItem("items")),
    });

    if (sessionStorage.getItem("sentinel") === "666") {
      this.startList();
      sessionStorage.setItem("sentinel", `661`);
    }

    if (this.state.mode === "0") this.fetchData();
  }

  handleClose() {
    if (JSON.parse(sessionStorage.getItem("items")))
      this.setState({
        itemsArray: JSON.parse(sessionStorage.getItem("items")),
      });
    if (this.state.listID || sessionStorage.getItem("listID"))
      this.updateList();

    this.setState({
      showModal: false,
    });
  }

  handleShow() {
    this.setState({
      showModal: true,
      itemsArray: JSON.parse(sessionStorage.getItem("items")),
    });
  }

  render() {
    return (
      <div>
        <Row>{this.props.dates}</Row>
        <Row>
          <Header />
        </Row>
        <div className="add-boton-div">
          <Row>
            <Button variant="outline-primary" onClick={this.handleShow}>
              Add Item
            </Button>
          </Row>
        </div>
        <Items
          items={
            this.state.mode === "0"
              ? this.state.savedItemsArray
              : this.state.itemsArray
          }
        />
        <Modal
          show={this.state.showModal}
          onHide={this.handleClose}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.dates}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <NewItem />
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
