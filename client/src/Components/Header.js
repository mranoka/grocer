import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="header" className="container">
        <div>
        <Col>
          <Row>
            <Col><span>o</span> Frozen Foods</Col>
            <Col><span>o</span> Dry Foods</Col>
          </Row>
          <Row>
            <Col><span>o</span> Household</Col>
            <Col><span>o</span> Wet Foods</Col>
          </Row>
        </Col>
        <Col>
          <div>TOTAL</div>
        </Col>
        </div>
        
      </div>
    );
  }
}
