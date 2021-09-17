import React from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";

export default class Items extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemCollection: [],
      updateResponse: ''
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.setState({
      itemCollection: [...this.props.items],
    });
  }

  updateList(newArray) {
    fetch(`/items/month/${sessionStorage.getItem("listID")}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [...newArray],
      }),
    })
      .then((res) => res.json())
      .then(
        (response) => {
          this.setState({
            updateResponse: response
          })
        },
        (err) => console.log(err)
      );
  }

  itemRemover(itemArray, item) {
    itemArray.forEach((element) => {
      if (element.itemName.includes(item)) {
        const index = itemArray.indexOf(element);
        itemArray.splice(index, 1);
      }
    });

    return itemArray;
  }

  handleDelete(event) {
    if (
      sessionStorage.getItem("mode") &&
      sessionStorage.getItem("mode") === "1"
    ) {
      this.updateList(this.itemRemover(this.props.items, event.target.value));
    }

    this.setState({
      itemCollection: this.itemRemover(this.props.items, event.target.value),
    });
  }

  render() {
    const itemsList = this.props.items?.map((item) => (
      <div id={Math.random() * 100}>
        <Row key={Math.random() * 200}>
          <Col key={Math.random() * 400}>
            <button onClick={this.handleDelete} value={item.itemName}>
              &times;
            </button>
          </Col>
          <Col key={Math.random() * 300}>
            <div>
              <span>{item.itemName}</span>
            </div>
          </Col>
          <Col key={Math.random() * 150}>
            <input type="number" step="1" value={item.quantity} />
          </Col>
          <Col key={Math.random() * 190}>
            <input type="number" value={item.price} />
          </Col>
          <Col>
            <input type="checkbox" value="" />
          </Col>
        </Row>
      </div>
    ));

    return <div>{itemsList}</div>;
  }
}
