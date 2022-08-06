import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsPersonCircle } from "react-icons/bs";
import { Redirect } from "react-router-dom";

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      signUpDate: "",
      userID: "",
      isDuplicateUser: false,
      redirect: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordEntry = this.handlePasswordEntry.bind(this);
    this.handleUsernameEntry = this.handleUsernameEntry.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.username && this.state.password) {
      // this.saveNewUser(this.state.username, this.state.password);

      this.startNewUserProfile(this.state.username, this.state.password);
    } else {
      return;
    }
  }

  startNewUserProfile(userName, passPhrase) {
    fetch("/new/userprofile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        passWord: passPhrase,
        isPrivileged: false,
        itemLists: [],
      }),
    })
      .then((res) => res.json())
      .then(
        (response) => {
          if (response.data) {
            this.saveNewUser(userName, passPhrase);

            this.setState({
              redirect: "/",
            });
          } else {
            this.setState({
              isDuplicateUser: true,
            });
          }
        },
        (err) => console.log(err)
      );
  }

  saveNewUser(userName, passPhrase) {
    fetch("/new/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        passWord: passPhrase,
        creationDate: new Date(),
      }),
    })
      .then((res) => res.json())
      .then(
        (response) => {
          this.setState({
            userID: response.data,
          });
        },
        (err) => console.log(err)
      );
  }

  handleUsernameEntry(e) {
    this.setState({
      username: e.target.value,
    });
  }

  handlePasswordEntry(e) {
    this.setState({
      password: e.target.value,
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <div>
        <Row id="sign-up-icon-container">
          <Col>
            <span id="sign-up-icon" onClick={this.handleToHome}>
              <BsPersonCircle size={150} />
            </span>
            <br />
            <span id="sign-up-label">Sign Up</span>
          </Col>
        </Row>
        <Row id="credentials-container">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                onChange={this.handleUsernameEntry}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Set Password"
                onChange={this.handlePasswordEntry}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
          {/* message if user already exists */}
          {this.state.isDuplicateUser ? (
            <span>
              Email Address Is Already In Use. <br />
              Please Use A Different Email Address To Sign Up
            </span>
          ) : (
            ""
          )}
        </Row>
      </div>
    );
  }
}
