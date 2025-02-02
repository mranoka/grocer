import React from "react";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/Col";
import "../index.css";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { BsArrowDownCircleFill } from "react-icons/bs";
import { useState } from 'react';
import { MdExpandCircleDown } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const controller = new AbortController();
const signal = controller.signal;

export default function Items(props) {
    const [updateResponse, setUpdateResponse] = useState('');
    const [itemsTotal, setItemsTotal] = useState(0);
    const [totalSentinel, setTotalSentinel] = useState(false);
    const [showExpander, setShowExpander] = useState(false);
    const [showShrinker, setShowShrinker] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

  function componentWillUnmount() {
    controller.abort();
  }

  function updateList(newArray) {
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
      },
      signal
    )
      .then((res) => res.json())
      .then(
        (response) => {
          setUpdateResponse(response);
        },
        (err) => console.log(err)
      )
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("successfully aborted");
        } else {
          console.log(err);
        }
      });
  }

  function removeSelectedItem(itemArray, itemId) {
    itemArray.forEach((element) => {
      if (element.uuid === itemId) {
        const index = itemArray.indexOf(element);
        itemArray.splice(index, 1);
      }
    });

    return itemArray;
  }

  function handleDelete(event) {
    if (
      sessionStorage.getItem("mode") &&
      sessionStorage.getItem("mode") === "1"
    ) {
      updateList(removeSelectedItem(props.items, event.target.value));
    }

    sessionStorage.setItem(
      "items",
      JSON.stringify(removeSelectedItem(props.items, event.target.value))
    );
  }

  function handlePriceCheck(event) {
    // blur list item if it is marked as done
    itemsList.forEach(item => {
      if(item.key == event.target.value) {
         let checkedItem = document.getElementById(item.key);
         if(event.target.checked)
          checkedItem.className = checkedItem.className + " item-status";
         else
          checkedItem.className = checkedItem.className.replace(" item-status", "");

        return;
      }
    })
  }

  function handlePriceChange(event) {
    props.items.forEach((item) => {
      if (item.uuid === event.target.id) {
        item.price = event.target.value;
      }
    });
    sessionStorage.setItem("items", JSON.stringify(props.items));

    if (!totalSentinel)
      setTotalSentinel(true);
  }

  function handleSubmit(event) {
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

    setItemsTotal(total);
    setTotalSentinel(false)

    // update remote list
    updateList(holderArray);
  }

  function handleQuantityChange(event) {
    props.items.forEach((item, index) => {
      if (event.target.id === item.uuid) {
        item.quantity = event.target.value;
      }
    });
    sessionStorage.setItem("items", JSON.stringify(props.items));

    if (!totalSentinel)
      setTotalSentinel(true);
  }

  function handleDiveResizerDisplay() {
    if (isExpanded) {
      setShowShrinker(true);

      setTimeout(() => {
        setShowShrinker(false);
      }, 8000);
    } else {
      setShowExpander(true);

      setTimeout(() => {
        setShowExpander(false);
      }, 5000);
    }
  }

  function handleItemDisplayExpand() {
    setIsExpanded(true);
    setShowExpander(false);
  }

  function handleItemDisplayShrink() {
    setIsExpanded(false);
    setShowShrinker(false);
  }

  function orderByCategory(itemsArray) {
    // avoid breaking app on initial load due to empty itemsArray
    if (itemsArray === null) {
      return;
    }
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

  let orderedArray = orderByCategory(props.items);
  const itemsList = orderedArray?.map((item, index) => (
    <div id={item.uuid} className={item.category + " item-container"} key={item.uuid}>
      <div key={item.uuid + "6"} className="items-row">
        <div key={item.uuid + "5"} className="item-delete-button">
          <button
            className="delete-boton x-marks-spot"
            onClick={handleDelete}
            value={item.uuid}
          >
          &times;
          </button>
        </div>
        <div key={item.uuid + "4"}>
          <div className="item-description">
            <span className="item-name">{item.itemName}</span>
          </div>
        </div>
        <div className="div-item-quantity" key={item.uuid + "3"}>
          <input
            className="item-quantity"
            type="number"
            step="1"
            placeholder={item.quantity}
            name="quantity"
            id={item.uuid}
            onChange={handleQuantityChange}
          />
        </div>
        <div key={item.uuid + "2"}>
          <input
            placeholder={item.price ?? "price"}
            className="item-price"
            type="number"
            id={item.uuid}
            name="priceSet"
            onChange={handlePriceChange}
          />
        </div>
        <div key={item.uuid + "1"}>
          <input
            className="item-checkbox"
            type="checkbox"
            value={item.uuid}
            onChange={handlePriceCheck}
            name={item.itemName + "priceCheck"}
          />
        </div>
      </div>
    </div>
  ));

    return (
      <form onSubmit={handleSubmit} id="items-list">
        <Row id="totals-row">
          <hr id="line-one" />
          <Col>
            <button type="submit" className="btn btn-dark" id="totalz-boton">
              Get Total
            </button>
          </Col>
          <Col>
            <span
              className={totalSentinel ? "strike-red" : "no-strike"}
              id="items-total"
            >
              {itemsTotal}
            </span>
          </Col>
          <hr id="line-two" />
        </Row>
        <div
          id="serious-container"
        >
          <div
            id="scroll-pane-expander"
            onClick={handleItemDisplayExpand}
            className={showExpander ? "" : "show-expander"}
          >
            <span id="expand">
              <BsFillArrowUpCircleFill size={50} color="blue" />
            </span>
          </div>
          <div
            id="scroll-pane-shrinker"
            onClick={handleItemDisplayShrink}
            className={showShrinker ? "" : "show-shrinker"}
          >
            <span id="shrink">
              <BsArrowDownCircleFill size={50} color="blue" />
            </span>
          </div>
          <div onScroll={handleDiveResizerDisplay} className={
            isExpanded
              ? "items-container-big"
              : "items-container-small"
          }
          >{itemsList}</div>
        </div>
      </form>
    );
}
