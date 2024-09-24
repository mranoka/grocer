import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { nanoid } from "nanoid";

let holderArray = [];

export default class NewItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: "",
      description: "",
      quantity: 1,
      itemCount: 0,
      sentinel: "0",
    };

    this.handleCategory = this.handleCategory.bind(this);
    this.handItemAdd = this.handleItemAdd.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
  }

  componentDidMount() {
    if (JSON.parse(sessionStorage.getItem("items"))) {
      this.setState({
        itemCount: JSON.parse(sessionStorage.getItem("items")).length,
      });

      holderArray = [...JSON.parse(sessionStorage.getItem("items"))];
    }
  }

  updateList(newArray) {
    fetch(
      `${process.env.REACT_APP_API_KEY}/list/items/month/${sessionStorage.getItem(
        "userID"
      )}/${sessionStorage.getItem("listID")}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [...newArray],
        }),
      }
    )
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

  handleCategory(event) {
    this.setState({ category: event.target.value });
  }
  handleQuantity(event) {
    this.setState({ quantity: event.target.value });
  }
  handleDescription(event) {
    this.setState({ description: event.target.value });
  }

  handleItemAdd = (event) => {
    event.preventDefault();

    const newItem = {
      itemName: this.state.description,
      category: this.state.category,
      price: null,
      quantity: this.state.quantity,
      uuid: nanoid().toString(),
    };

    holderArray.push(newItem);

    this.updateList(holderArray)
    
    this.setState((state) => ({
      sentinel: "1",
      itemCount: state.itemCount + 1,
    }));

    sessionStorage.setItem("items", JSON.stringify(holderArray));

    // reset values
    this.setState({
      category: "",
      description: "",
      quantity: 1,
    });
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.handleItemAdd}>
          <div>
            <h6>
              Number of items added:
              {this.state.itemCount}
            </h6>
          </div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Item Description"
              value={this.state.description}
              onChange={this.handleDescription}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Category:</Form.Label>
            <Form.Select
              required
              aria-label="Default select example"
              onChange={this.handleCategory}
              value={this.state.category}
            >
              <option value="">Select Food Category</option>
              <option value="household">Household</option>
              <option value="frozen">Refrigerated Foods</option>
              <option value="wet">Wet Foods</option>
              <option value="dry">Dry Foods</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicQuantity">
            <Form.Label>Quantity:</Form.Label>
            <Form.Control
              type="number"
              value={this.state.quantity}
              onChange={this.handleQuantity}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add
          </Button>
        </Form>
      </div>
    );
  }
}
