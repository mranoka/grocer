import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { GiHouse } from "react-icons/gi";
import { GiThermometerCold } from "react-icons/gi";
import { GiDesert } from "react-icons/gi";
import { FaHandHoldingWater } from "react-icons/fa";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { Navigate } from "react-router-dom";
import "../index.css";

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };

    this.handleToHome = this.handleToHome.bind(this);
  }

  handleToHome() {
    this.setState({
      redirect: "/",
    });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    return (
      <div id="header" className="header-container">
        <div>
          <Row>
            <Col>
              <span onClick={this.handleToHome}>
                <BsFillArrowLeftCircleFill size={30} />
              </span>
            </Col>
          </Row>
          <Row className="top-header-row">
            <Col id="refrigerated">
              <span className="cat-icon">
                <GiThermometerCold />
              </span>{" "}
              Refrigerated
            </Col>
            <Col id="dry-foods">
              <span className="cat-icon">
                <GiDesert />
              </span>{" "}
              Dry Foods
            </Col>
          </Row>
          <Row className="bottom-header-row">
            <Col id="household-icon">
              <span className="cat-icon">
                <GiHouse />
              </span>{" "}
              Household
            </Col>
            <Col id="wet-foods">
              <span className="cat-icon">
                <FaHandHoldingWater />
              </span>{" "}
              Wet Foods
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
