import React from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
import "../index.css";

export default class Items extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updateResponse: "",
      itemPrice: "",
      itemsTotal: 0,
      priceSet: "",
      totalSentinel: false,
      priceCheck: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handlePriceCheck = this.handlePriceCheck.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
  }

  componentDidMount() {}

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

    sessionStorage.setItem(
      "items",
      JSON.stringify(this.itemRemover(this.props.items, event.target.value))
    );
  }

  handlePriceCheck(event) {
    console.log(event.target.className);
    // this.setState({
    //   priceCheck: event.target.checked
    // })
  }

  handlePriceChange(event) {
    this.props.items.forEach((item) => {
      if (item.uuid === event.target.id) {
        item.price = event.target.value;
      }
    });
    sessionStorage.setItem("items", JSON.stringify(this.props.items));

   // console.log(JSON.parse(sessionStorage.getItem("items")))

    if (!this.state.totalSentinel)
      this.setState({
        totalSentinel: true,
      });
  }

  handleSubmit(event) {
    event.preventDefault(); // prevent page reload on form submission
    let holderArray = [];
    let total = 0;

    if (JSON.parse(sessionStorage.getItem("items")))
      holderArray = [...JSON.parse(sessionStorage.getItem("items"))]; 
    // get items total
    holderArray.forEach((item) => {
      if (item.price) {
        total += parseInt(item.price) * parseInt(item.quantity);
      }
      
    });

    this.setState({
      itemsTotal: total,
      totalSentinel: false,
    });

    // update remote list
    this.updateList(holderArray);
  }

  handleQuantityChange(event) {
    console.log(event.target.id)
    this.props.items.forEach((item, index) => {
      if (event.target.id=== item.uuid) {
        item.quantity = event.target.value;
        console.log(item.itemName)
      }
    });
    sessionStorage.setItem("items", JSON.stringify(this.props.items));

    if (!this.state.totalSentinel)
      this.setState({
        totalSentinel: true,
      });
  }

  orderByCategory(itemsArray) {
    let dryArray = [];
    let wetArray = [];
    let houseArray = [];
    let frozenArray = [];

    itemsArray.forEach((item) => {
      if (item.category === "household") houseArray.push(item);
      else if (item.category === "frozen") frozenArray.push(item);
      else if (item.category === "wet") wetArray.push(item);
      else dryArray.push(item);
    });

    return [...houseArray, ...frozenArray, ...dryArray, ...wetArray];
  }

  render() {
    let orderedArray = this.orderByCategory(this.props.items);
    const itemsList = orderedArray?.map((item, index) => (
      <div id={item.category} className="item-container" key={item.uuid}>
        <Row key={item.uuid + "6"}>
          <Col key={item.uuid + "5"}>
            <button
              className="btn btn-danger"
              onClick={this.handleDelete}
              value={item.itemName}
            >
              &times;
            </button>
          </Col>
          <Col key={item.uuid + "4"}>
            <div className="item-description">
              <span className="item-name">{item.itemName}</span>
            </div>
          </Col>
          <Col key={item.uuid + "3"}>
            <input
              className="item-quantity"
              type="number"
              step="1"
              placeholder={item.quantity}
              name="quantity"
              id={item.uuid}
              onChange={this.handleQuantityChange}
            />
          </Col>
          <Col key={item.uuid + "2"}>
            <input
              placeholder={item.price ?? "price"}
              className="item-price"
              type="number"
              id={item.uuid}
              name="priceSet"
              onChange={this.handlePriceChange}
            />
          </Col>
          <Col key={item.uuid + "1"}>
            <input
              className="item-checkbox"
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
        <Row id="totals-row">
          <hr id="line-one" />
          <Col>
            <button type="submit" className="btn btn-dark" id="totalz-boton">
              Get Total
            </button>
          </Col>
          <Col>
            <span
              className={this.state.totalSentinel ? "strike-red" : "no-strike"}
              id="items-total"
            >
              {this.state.itemsTotal}
            </span>
          </Col>
          <hr id="line-two" />
        </Row>

        <div id="serious-container">{itemsList}</div>
      </form>
    );
  }
}
