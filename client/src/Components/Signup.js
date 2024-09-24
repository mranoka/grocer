import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { FallingLines } from "react-loader-spinner";
import { useState } from 'react';

export default function Signup() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDuplicateUser, setIsDuplicateUser] = useState(false);
  const [isLoaderDisplayed, setIsLoaderDisplayed] = useState(false);
  const navigate = useNavigate();

  function startSignUpProgressSpinner() {
    setIsLoaderDisplayed(true);
  }

  function stopSignUpProgressSpinner() {
    setIsLoaderDisplayed(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsDuplicateUser(false);
    if (username && password)
      startNewUserProfile(username, password);
    else return;
  }

  function startNewUserProfile(userName, passPhrase) {
    startSignUpProgressSpinner();
    fetch(`${process.env.REACT_APP_API_KEY}/new/userprofile`, {
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
            sessionStorage.setItem(
              "user",
              JSON.stringify({
                isLoggedIn: true,
                user: userName,
                expiration: new Date().getTime() / 1000 + 12 * 60 * 60,
              })
            );

            fetch(`${process.env.REACT_APP_API_KEY}/new/user`, {
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
                  stopSignUpProgressSpinner();
            
                  navigate("/");
                },
                (err) => console.log(err)
              );         

          } else {
            setIsDuplicateUser(true);
            stopSignUpProgressSpinner();
           }
        },
      ).catch(err => {
        console.log(err)
      });
  }

  function handleUsernameEntry(e) {
    setUsername(e.target.value);
  }

  function handlePasswordEntry(e) {
    setPassword(e.target.value)
  }

  function handleToHome() {
return;
  }


  function handleToLogin() {
    navigate("/login")
  }

    return (
      <div>
        <Row id="to-login-button">
          <Col>
            <span onClick={handleToLogin}>
              <BsFillArrowLeftCircleFill size={30} />
            </span>
          </Col>
        </Row>
        <Row id="sign-up-icon-container">
          <Col>
            <span id="sign-up-icon" onClick={handleToHome}>
              <BsPersonCircle size={150} />
            </span>
            <br />
            <span id="sign-up-label">Sign Up</span>
          </Col>
        </Row>
        <Row id="credentials-container">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                onChange={handleUsernameEntry}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Set Password"
                onChange={handlePasswordEntry}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
            <FallingLines
              color="#0d6efd"
              width="75"
              visible={isLoaderDisplayed}
              ariaLabel="falling-lines-loading"
            />
          </Form>
          {/* message if user already exists */}
          {isDuplicateUser ? (
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
