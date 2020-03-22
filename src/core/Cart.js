import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCart } from "./cartHelpers";
import Card from "./Card";
import Checkout from "./Checkout";
import EventPicker from "./EventPicker";
import { isAuthenticated } from "../auth";
import { CartLockContext } from "../Routes";
import { EventContext } from "../EventContext";

import moment from "moment";

import { getEventHistory } from "../user/apiUser";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [eventHistory, setEventHistory] = useState([]);

  var curEvent = localStorage.getItem("eventSelected");

  const cartLockerContext = useContext(CartLockContext);
  const context = useContext(EventContext);

  // Get number of days between start and end date
  const date1 = new Date(localStorage.getItem("eventStartDate"));
  const date2 = new Date(localStorage.getItem("eventEndDate"));
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Get number of hours between delivery time and pickup time
  function diff_hours(deliveryTime, pickupTime) {
    var diff = (pickupTime.getTime() - deliveryTime.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  const deliveryTime = new Date(localStorage.getItem("eventDeliveryTime"));
  const pickupTime = new Date(localStorage.getItem("eventPickupTime"));
  const startDate = new Date(`${localStorage.getItem("eventStartDate")}`);
  var endDate = new Date(`${localStorage.getItem("eventEndDate")}`);

  useEffect(() => {
    setItems(getCart());
  }, [items]);

  const showItems = items => {
    return (
      <div>
        <h2>{`${items.length}`} item(s) ready to rent!</h2>
        <hr />
        {items.map((product, i) => (
          <Card
            key={i}
            product={product}
            showAddToCartButton={false}
            cartUpdate={true}
            showRemoveProductButton={true}
          />
        ))}
      </div>
    );
  };

  const noItemsMessage = () => (
    <h2>
      Your cart is empty. <br /> <Link to="/shop">Continue shopping</Link>
    </h2>
  );

  const activeEventBody = () => {
    return isAuthenticated() && cartLockerContext.cartLockerState.cartLock ? (
      <div className="row" style={{ marginTop: "50px" }}>
        <div className="col-md-6">
          {items.length > 0 ? showItems(items) : noItemsMessage()}
        </div>

        <div className="col-md-6">
          <h2 className="mb-4">Your cart summary </h2>
          You're renting for {curEvent} <br />
          This is a {diffDays} day event <br />
          <br /> {moment(startDate).format("MMM DD, YYYY")} -{" "}
          {moment(endDate).format("MMM DD, YYYY")} <br />
          <br />
          Your event is {diff_hours(deliveryTime, pickupTime)} hour(s)
          <br />
          <hr />
          <Checkout products={items} />
        </div>
      </div>
    ) : isAuthenticated() ? (
      <div style={{ marginTop: "50px" }}>
        <EventPicker event={context} />
      </div>
    ) : (
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <h2>Sign in to checkout arcade games</h2>
        <iframe
          src="https://giphy.com/embed/xUOwGaJibmM1FWfmqk"
          width="250"
          frameBorder="0"
          class="giphy-embed"
          allowFullScreen
          style={{ pointerEvents: "none" }}
        ></iframe>
        <br />
        <Link to="/signin">
          <button className="btn btn-lg btn-primary">Sign In Here</button>
        </Link>
      </div>
    );
  };

  return (
    <Layout
      title="Shopping Cart"
      description="Manage your cart items. Add remove checkout or continue shopping."
      className="container-fluid"
    >
      <div>{activeEventBody()}</div>
    </Layout>
  );
};

export default Cart;
