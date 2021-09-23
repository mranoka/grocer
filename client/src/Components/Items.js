import React from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
import "../index.css";
import Header from "./Header";

export default class Items extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      itemCollection: [],
      itemHolderArr: [],
      updateResponse: "",
      itemPrice: "",
      itemsTotal: 0,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handlePriceCheck = this.handlePriceCheck.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log("mount");
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
            updateResponse: response,
          });
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

    sessionStorage.setItem(
      "items",
      JSON.stringify(this.itemRemover(this.props.items, event.target.value))
    );
  }

  handlePriceCheck(event) {
    console.log(event.target.checked);
    console.log(event.target.value);
  }

  handlePriceChange(event) {
    const value = event.target.value;
    // this.setState({
    //   itemPrice: event.target.value,
    // });
    console.log(`${event.target.name} & ${value}`);
    this.setState({
      [event.target.name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault(); // prevent page reload on form submission
    let holderArray = [];
    let total = 0;

    let itemsHolder = [];
    this.props.items?.forEach((item, index) => {
      itemsHolder.push(`${item.itemName}${index}1`);
    });

    itemsHolder.forEach((itemOut) => {
      if (event.target.elements[itemOut].value) {
        let itemName = event.target.elements[itemOut].name.slice(
          0,
          event.target.elements[itemOut].name.length - 1
        );
        
        event.target.elements["quantity"].forEach((item) => {
          // calculate price total
          if (item.id === itemName) {
            total +=
              parseInt(event.target.elements[itemOut].value) * item.value;
          }
        });
        // set prices for items
        this.props.items?.forEach((listItem, index) => {
          if (`${listItem.itemName}${index}` === itemName && listItem.price === null) {
            listItem.price =
              parseInt(event.target.elements[itemOut].value) *
              listItem.quantity;
          }
          holderArray.push(listItem);
        });
      }
    });

    sessionStorage.setItem("items", JSON.stringify(holderArray));

    // sessionStorage.setItem('total', total) may use later

    console.log(total);

    this.setState({
      itemsTotal: total,
    });
  }

  render() {
    const itemsList = this.props.items?.map((item, index) => (
      <div className="item-container" key={Math.random() * 100}>
        <Row key={Math.random() * 200}>
          <Col key={Math.random() * 400}>
            <button
              className="btn btn-danger"
              onClick={this.handleDelete}
              value={item.itemName}
            >
              &times;
            </button>
          </Col>
          <Col key={Math.random() * 300}>
            <div className="item-description">
              <span>{item.itemName}</span>
            </div>
          </Col>
          <Col key={Math.random() * 150}>
            <input
              className="item-quantity"
              type="number"
              step="1"
              value={item.quantity}
              name="quantity"
              id={item.itemName + index}
            />
          </Col>
          <Col key={Math.random() * 190}>
            <input
              value={item.price}
              className="item-price"
              type="number"
              placeholder="price"
              name={item.itemName + index + "1"}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              value=""
              onChange={this.handlePriceCheck}
              name={item.itemName + "priceCheck"}
            />
          </Col>
        </Row>
      </div>
    ));

    return (
      <form onSubmit={this.handleSubmit} id="items-list">
        <hr />
        <Row>
          <Col>
            <button type="submit" className="btn btn-dark">
              Get Total
            </button>
          </Col>
          <Col>{this.state.itemsTotal}</Col>
        </Row>
        <hr />
        {itemsList}
      </form>
    );
  }
}
