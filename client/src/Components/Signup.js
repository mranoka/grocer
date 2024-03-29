import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsPersonCircle } from "react-icons/bs";
import { Navigate } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { FallingLines } from "react-loader-spinner";

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
      isLoaderDisplayed: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordEntry = this.handlePasswordEntry.bind(this);
    this.handleUsernameEntry = this.handleUsernameEntry.bind(this);
    this.handleToLogin = this.handleToLogin.bind(this);
  }

  handleToLogin() {
    this.setState({
      redirect: "/login",
    });
  }

  startSignUpProgressSpinner() {
    this.setState({
      isLoaderDisplayed: true,
    });
  }

  stopSignUpProgressSpinner() {
    this.setState({
      isLoaderDisplayed: false,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.username && this.state.password)
      this.startNewUserProfile(this.state.username, this.state.password);
    else return;
  }

  startNewUserProfile(userName, passPhrase) {
    this.startSignUpProgressSpinner();
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
            sessionStorage.setItem(
              "user",
              JSON.stringify({
                isLoggedIn: true,
                user: userName,
                expiration: new Date().getTime() / 1000 + 12 * 60 * 60,
              })
            );
            this.setState({
              redirect: "/",
            });
            this.stopSignUpProgressSpinner();
          } else {
            this.setState({
              isDuplicateUser: true,
            });
            this.stopSignUpProgressSpinner();
          }
        },
      ).catch(err => {
        console.log(err)
      });
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
      return <Navigate to={this.state.redirect} />;
    }

    return (
      <div>
        <Row id="to-login-button">
          <Col>
            <span onClick={this.handleToLogin}>
              <BsFillArrowLeftCircleFill size={30} />
            </span>
          </Col>
        </Row>
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
            <FallingLines
              color="#0d6efd"
              width="75"
              visible={this.state.isLoaderDisplayed}
              ariaLabel="falling-lines-loading"
            />
          </Form>
          {/* message if user already exists */}
          {this.state.isDuplicateUser ? (
            <span id="duplicate-user-warning">
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
