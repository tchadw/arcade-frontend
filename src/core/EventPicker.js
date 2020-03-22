import React, { useState, useEffect, useContext } from "react";
import { EventContext } from "../EventContext";
import { CartLockContext } from "../Routes";
import { useLocalState } from "../LocalStorageHook";

import { isAuthenticated } from "../auth";
import { getEventHistory } from "../user/apiUser";
import moment from "moment";

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const EventPicker = () => {
  const [eventHistory, setEventHistory] = useState([]);
  const [eventSelected, setEvent] = useLocalState("eventSelected");

  var curEvent = localStorage.getItem("eventSelected");

  const eventVal = useContext(EventContext);
  const cartLockerContext = useContext(CartLockContext);

  const startDate = new Date(`${localStorage.getItem("eventStartDate")}`);
  const endDate = new Date(`${localStorage.getItem("eventEndDate")}`);

  const init = (userId, token) => {
    getEventHistory(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setEventHistory(data);
      }
    });
  };

  useEffect(() => {
    let _id = "";
    let token = "";

    if (localStorage.getItem("jwt") === null) {
      _id = "";
      token = "";
    } else {
      _id = isAuthenticated().user._id;
      token = isAuthenticated().token;
    }

    init(_id, token);
  }, []);

  const eventHistoryList = eventHistory => {
    return (
      <DropdownButton
        id="dropdown-item-button"
        title="Your Events"
        className="buttonText"
      >
        {eventHistory.map((h, i) => {
          return (
            <Dropdown.Item
              as="button"
              onClick={() => [
                setEvent(`${h.eventName}`),
                localStorage.setItem("eventStartDate", `${h.startDate}`),
                localStorage.setItem("eventEndDate", `${h.endDate}`),
                localStorage.setItem("eventDeliveryTime", `${h.deliveryTime}`),
                localStorage.setItem("eventPickupTime", `${h.pickupTime}`),
                localStorage.setItem("eventAddressOne", `${h.addressOne}`),
                localStorage.setItem("eventCity", `${h.city}`),
                localStorage.setItem("eventState", `${h.state}`),
                localStorage.setItem("eventCountry", `${h.country}`),
                localStorage.setItem("eventZipCode", `${h.zipCode}`),
                cartLockerContext.cartLockerDispatch({ type: "unlock" })
              ]}
            >
              {h.eventName}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    );
  };

  const noEventSelected = () => {
    return (
      <div class="card">
        <h5 class="card-header">Attention User</h5>
        <div class="card-body">
          <h5 class="card-title">Select an Event </h5>
          <p class="card-text">
            In order to checkout items, please select one of your events.
          </p>
          {eventHistoryList(eventHistory)}
        </div>
      </div>
    );
  };

  const eventMode = () => {
    return (
      <div class="card">
        <h5 class="card-header">Currently Renting For</h5>
        <div class="card-body">
          <h5 class="card-title" style={{ marginBottom: "10px" }}>
            {curEvent}
          </h5>
          {moment(startDate).format("MMM DD, YYYY")} -{" "}
          {moment(endDate).format("MMM DD, YYYY")} <br />
          <br />
          <button
            type="button"
            class="btn btn-danger"
            onClick={() => [
              setEvent(""),
              localStorage.setItem("eventStartDate", null),
              localStorage.setItem("eventEndDate", null),
              localStorage.setItem("eventDeliveryTime", null),
              localStorage.setItem("eventPickupTime", null),
              localStorage.setItem("eventAddressOne", null),
              localStorage.setItem("eventCity", null),
              localStorage.setItem("eventState", null),
              localStorage.setItem("eventCountry", null),
              localStorage.setItem("eventZipCode", null),
              cartLockerContext.cartLockerDispatch({ type: "lock" })
            ]}
          >
            Clear Event
          </button>
        </div>
      </div>
    );
  };

  const checkEvent = () => {
    if (
      localStorage.getItem("eventSelected") === "" ||
      localStorage.getItem("eventSelected") === null
    ) {
      return <div>{noEventSelected()}</div>;
    }
    return <div>{eventMode()}</div>;
  };

  return <div>{checkEvent()}</div>;
};

export default EventPicker;
