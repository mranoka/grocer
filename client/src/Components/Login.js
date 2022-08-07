import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsPersonCircle } from "react-icons/bs";
import { Redirect } from "react-router-dom";
import "../index.css";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      username: "",
      redirect: null,
      showAuthError: "show-error-message"
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailEntry = this.handleEmailEntry.bind(this);
    this.handlePasswordEntry = this.handlePasswordEntry.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    if(this.state.password && this.state.username) {
      fetch("/auth/user", {
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
            if(response.authStatus) {
            sessionStorage.setItem("user", JSON.stringify({isLoggedIn: `${response.authStatus}`,user: this.state.username, expiration: (new Date().getTime() / 1000) + (12 * 60 * 60)}));
              
            this.setState({
              redirect: "/"
            })
            } else {
              sessionStorage.removeItem("user");
              
              this.setState({
                showAuthError: ""
              })
            }
          },
          (err) => console.log(err)
        );
    } else {
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

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <div>
        <Row id='login-icon-row'>
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
              <Form.Text className="text-muted">
                
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password"  onChange={this.handlePasswordEntry}/>
            </Form.Group>
            <Button variant="dark" type="submit">
              Login
            </Button>
            <div id="sign-up-prompt">
            Not a user? Sign Up <a href="/signup">Here</a>
            </div>
            <div className={this.state.showAuthError}>
              Password & Username Combination Are Invalid. Please Try Again
            </div>
          </Form>
        </Row>
      </div>
    );
  }
}
