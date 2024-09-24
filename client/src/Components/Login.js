import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsPersonCircle } from "react-icons/bs";
import { Navigate } from "react-router-dom";
import { FallingLines } from "react-loader-spinner";
import "../index.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      username: "",
      redirect: null,
      showAuthError: "show-error-message",
      isLoaderDisplayed: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailEntry = this.handleEmailEntry.bind(this);
    this.handlePasswordEntry = this.handlePasswordEntry.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.startLoginProgressSpinner();

    if (this.state.password && this.state.username) {
      fetch("https://grocerapp.onrender.com/auth/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: this.state.username,
          passWord: this.state.password,
        }),
      })
        .then((res) => res.json())
        .then(
          (response) => {
            this.stopLoginProgressSpinner();
            if (response.authStatus !== "false") {
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  isLoggedIn: `${response.authStatus}`,
                  userID: `${response.user}`,
                  user: this.state.username,
                  expiration: new Date().getTime() / 1000 + 12 * 60 * 60,
                })
              );

              this.setState({
                redirect: "/",
              });
            } else {
              sessionStorage.removeItem("user");

              this.setState({
                showAuthError: "",
              });
            }
          },
        ).catch(err =>{
          console.log(err)
        });;
    } else {
      this.stopLoginProgressSpinner();
      return;
    }
  }

  handleEmailEntry(e) {
    this.setState({
      username: e.target.value,
    });
  }

  handlePasswordEntry(e) {
    this.setState({
      password: e.target.value,
    });
  }

  startLoginProgressSpinner() {
    this.setState({
      isLoaderDisplayed: true,
    });
  }

  stopLoginProgressSpinner() {
    this.setState({
      isLoaderDisplayed: false,
    });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }
    return (
      <div id="login-container-div">
        <Row id="login-icon-row">
          <Col>
            <span onClick={this.handleToHome}>
              <BsPersonCircle size={150} />
            </span>
            <br />
            <span id="login-label">Sign In</span>
          </Col>
        </Row>
        <Row id="login-container">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={this.handleEmailEntry}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={this.handlePasswordEntry}
              />
            </Form.Group>
            <Button variant="dark" type="submit">
              Login
            </Button>
            <FallingLines
              color="#000000"
              width="75"
              visible={this.state.isLoaderDisplayed}
              ariaLabel="falling-lines-loading"
            />
            <div id="sign-up-prompt">
              Not a user? Sign Up <a href="/signup">Here</a>
            </div>
            <div
              id="warning-text-wrong-creds"
              className={this.state.showAuthError}
            >
              Password & Username Combination Are Invalid. Please Try Again
            </div>
          </Form>
        </Row>
      </div>
    );
  }
}
