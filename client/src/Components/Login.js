import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsPersonCircle } from "react-icons/bs";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      username: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailEntry = this.handleEmailEntry.bind(this);
    this.handlePasswordEntry = this.handlePasswordEntry.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

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
    return (
      <div>
        <Row>
          <Col>
            <span onClick={this.handleToHome}>
              <BsPersonCircle size={30} />
            </span>
            <br />
            <span>Sign In</span>
          </Col>
        </Row>
        <Row>
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
            <div>
            Not a user? Sign Up <a href="/signup">Here</a>
            </div>
          </Form>
        </Row>
      </div>
    );
  }
}
