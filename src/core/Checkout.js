import React, { useState, useEffect, useContext } from "react";
import {
  getProducts,
  getBraintreeClientToken,
  processPayment,
  createOrder
} from "./apiCore";
import EventPicker from "./EventPicker";
import { emptyCart } from "./cartHelpers";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import "braintree-web";
import DropIn from "braintree-web-drop-in-react";
import { CartLockContext } from "../Routes";
import { EventContext } from "../EventContext";

const Checkout = ({ products }) => {
  const eventDeliveryTime = localStorage.getItem("eventDeliveryTime");
  const eventPickupTime = localStorage.getItem("eventPickupTime");
  const eventAddressOne = localStorage.getItem("eventAddressOne");
  const eventCity = localStorage.getItem("eventCity");
  const eventState = localStorage.getItem("eventState");
  const eventCountry = localStorage.getItem("eventCountry");
  const eventZipCode = localStorage.getItem("eventZipCode");

  const cartLockerContext = useContext(CartLockContext);
  const context = useContext(EventContext);

  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: `${eventAddressOne}`
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  // Get number of days between start and end date
  const date1 = new Date(localStorage.getItem("eventStartDate"));
  const date2 = new Date(localStorage.getItem("eventEndDate"));
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Get number of hours between delivery time and pickup time
  function diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  const deliveryTime = new Date(localStorage.getItem("eventDeliveryTime"));
  const pickupTime = new Date(localStorage.getItem("eventPickupTime"));
  diff_hours(deliveryTime, pickupTime);

  const days = parseInt(`${diffDays}`);
  const hours = parseInt(`${diff_hours(deliveryTime, pickupTime)}`);

  const getToken = (userId, token) => {
    getBraintreeClientToken(userId, token).then(data => {
      if (data.error) {
        setData({ ...data, error: data.error });
      } else {
        setData({ clientToken: data.clientToken });
      }
    });
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const handleAddress = event => {
    setData({ ...data, address: event.target.value });
  };

  const getTotal = () => {
    var rate = null;

    if (days <= 1) {
      rate = hours;
    } else {
      rate = days;
    }

    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.hourlyPrice * rate;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() &&
      cartLockerContext.cartLockerState.cartLock &&
      localStorage.getItem("eventSelected") ? (
      <div>{showDropIn()}</div>
    ) : isAuthenticated() ? (
      <EventPicker event={context} />
    ) : (
      <Link to="/signin">
        <button className="btn btn-primary">Sign in to checkout</button>
      </Link>
    );
  };

  let deliveryAddress = data.address;

  const buy = () => {
    setData({ loading: true });
    // send the nonce to your server
    // nonce = data.instance.requestPaymentMethod()
    let nonce;
    let getNonce = data.instance
      .requestPaymentMethod()
      .then(data => {
        // console.log(data);
        nonce = data.nonce;
        // once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
        // and also total to be charged
        // console.log(
        //     "send nonce and total to process: ",
        //     nonce,
        //     getTotal(products)
        // );
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getTotal(products)
        };

        processPayment(userId, token, paymentData)
          .then(response => {
            console.log(response);
            // empty cart
            // create order

            const createOrderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
              address: deliveryAddress
            };

            createOrder(userId, token, createOrderData)
              .then(response => {
                emptyCart(() => {
                  console.log("payment success and empty cart");
                  setData({
                    loading: false,
                    success: true
                  });
                });
              })
              .catch(error => {
                console.log(error);
                setData({ loading: false });
              });
          })
          .catch(error => {
            console.log(error);
            setData({ loading: false });
          });
      })
      .catch(error => {
        // console.log("dropin error: ", error);
        setData({ ...data, error: error.message });
      });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="gorm-group mb-3">
            Delivery address: <br />
            {eventAddressOne} <br />
            {eventCity} <br />
            {eventState} <br />
            {eventZipCode} <br />
            {eventCountry}
          </div>
          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault"
              }
            }}
            onInstance={instance => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Pay
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = error => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = success => (
    <div
      className="alert alert-info"
      style={{ display: success ? "" : "none" }}
    >
      Thanks! Your payment was successful!
    </div>
  );

  const showLoading = loading =>
    loading && <h2 className="text-danger">Loading...</h2>;

  return (
    <div>
      <h2>Total: ${getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
