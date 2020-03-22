import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { createEvent } from "./apiUser";

const { user, token } = isAuthenticated();
const uuidv4 = require("uuid/v4");

const generateEventId = uuidv4;

const AddEvent = () => {
  const [values, setValues] = useState({
    step: 1,
    primaryContactName: "",
    primaryContactNumber: "",
    secondaryContactName: "",
    secondaryContactNumber: "",
    eventName: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    addressOne: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    shippingNeeded: false,
    deliveryTime: "",
    pickupTime: "",
    comments: "",
    createdEvent: "",
    loading: false,
    error: "",
    redirectToProfile: false,
    formData: ""
  });

  const {
    step,
    primaryContactName,
    primaryContactNumber,
    secondaryContactName,
    secondaryContactNumber,
    eventName,
    startDate,
    startTime,
    endDate,
    endTime,
    addressOne,
    city,
    state,
    country,
    zipCode,
    shippingNeeded,
    deliveryTime,
    pickupTime,
    comments,
    createdEvent,
    loading,
    error,
    redirectToProfile,
    formData
  } = values;

  // Proceed to next step
  const nextStep = () => {
    setValues({ ...values, step: step + 1 });
  };

  // Go back to prev step
  const prevStep = () => {
    setValues({ ...values, step: step - 1 });
  };

  const next = event => {
    event.preventDefault();
    nextStep();
  };

  const back = event => {
    event.preventDefault();
    prevStep();
  };

  // load categories and set form data
  const init = () => {
    setValues({
      ...values,
      formData: new FormData()
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange = name => event => {
    const value = event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = event => {
    event.preventDefault();

    // Default data values (non-user input)
    formData.set("eventId", `event-${generateEventId()}`);
    formData.set("userId", `${user._id}`);
    formData.set("orderPlaced", "false");

    setValues({ ...values, error: "", loading: true });

    createEvent(user._id, token, formData).then(data => {
      if (data.error) {
        console.log(formData.values);
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          step: 1,
          primaryContactName: "",
          primaryContactNumber: "",
          secondaryContactName: "",
          secondaryContactNumber: "",
          eventName: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          addressOne: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
          shippingNeeded: false,
          deliveryTime: "",
          pickupTime: "",
          comments: "",
          createdEvent: "",
          loading: false,
          error: "",
          createdProduct: data.name
        });
      }
    });
  };

  const generalInfoStep = () => (
    <div>
      <h3>General Information</h3>
      <br />

      <div className="form-group">
        <label className="text-muted">Event Name</label>
        <input
          onChange={handleChange("eventName")}
          type="text"
          className="form-control"
          value={eventName}
          placeholder="Example: Chad's Birthday Party"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Start Date/Time</label>
        <input
          onChange={handleChange("startDate")}
          type="datetime-local"
          className="form-control"
          value={startDate}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">End Date/Time</label>
        <input
          onChange={handleChange("endDate")}
          type="datetime-local"
          className="form-control"
          value={endDate}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Primary Contact Name</label>
        <input
          onChange={handleChange("primaryContactName")}
          type="text"
          className="form-control"
          value={primaryContactName}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Primary Contact Number</label>
        <input
          onChange={handleChange("primaryContactNumber")}
          type="text"
          className="form-control"
          value={primaryContactNumber}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Secondary Contact Name</label>
        <input
          onChange={handleChange("secondaryContactName")}
          type="text"
          className="form-control"
          value={secondaryContactName}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Secondary Contact Number</label>
        <input
          onChange={handleChange("secondaryContactNumber")}
          type="text"
          className="form-control"
          value={secondaryContactNumber}
        />
      </div>

      <button className="btn btn-primary" onClick={next}>
        Next
      </button>
    </div>
  );

  const shippingInfoStep = () => (
    <div>
      <h3>Shipping Information</h3>
      <br />
      <div className="form-group">
        <label className="text-muted">Shipping Needed</label>
        <select
          onChange={handleChange("shippingNeeded")}
          className="form-control"
        >
          <option>Please select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Address</label>
        <input
          onChange={handleChange("addressOne")}
          type="text"
          className="form-control"
          value={addressOne}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">City</label>
        <input
          onChange={handleChange("city")}
          type="text"
          className="form-control"
          value={city}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">State</label>
        <input
          onChange={handleChange("state")}
          type="text"
          className="form-control"
          value={state}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Country</label>
        <input
          onChange={handleChange("country")}
          type="text"
          className="form-control"
          value={country}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Zip Code</label>
        <input
          onChange={handleChange("zipCode")}
          type="text"
          className="form-control"
          value={zipCode}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Delivery Needed By</label>
        <input
          onChange={handleChange("deliveryTime")}
          type="datetime-local"
          className="form-control"
          value={deliveryTime}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Pickup Needed By</label>
        <input
          onChange={handleChange("pickupTime")}
          type="datetime-local"
          className="form-control"
          value={pickupTime}
        />
      </div>
      <button className="btn btn-danger" onClick={back}>
        Back
      </button>{" "}
      <button className="btn btn-primary" onClick={next}>
        Next
      </button>
    </div>
  );

  const commentStep = () => (
    <div>
      <h3>Additional Comments</h3>
      <br />
      <div className="form-group">
        <label className="text-muted">Comments</label>
        <input
          onChange={handleChange("comments")}
          type="text"
          className="form-control"
          value={comments}
          placeholder="Request equipment setup, special lifting, etc."
        />
      </div>
      <button className="btn btn-danger" onClick={back}>
        Back
      </button>{" "}
      <button className="btn btn-primary" onClick={next}>
        Next
      </button>
    </div>
  );

  const confirmStep = () => (
    <div>
      <h3>Confirm Event Information</h3>
      <h4>General Information</h4>
      <div className="form-group">
        <label className="text-muted">Event Name</label>
        <input
          onChange={handleChange("eventName")}
          type="text"
          className="form-control"
          value={eventName}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Start Date/Time</label>
        <input
          onChange={handleChange("startDate")}
          type="datetime-local"
          className="form-control"
          value={startDate}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">End Date/Time</label>
        <input
          onChange={handleChange("endDate")}
          type="datetime-local"
          className="form-control"
          value={endDate}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Primary Contact Name</label>
        <input
          onChange={handleChange("primaryContactName")}
          type="text"
          className="form-control"
          value={primaryContactName}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Primary Contact Number</label>
        <input
          onChange={handleChange("primaryContactNumber")}
          type="text"
          className="form-control"
          value={primaryContactNumber}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Secondary Contact Name</label>
        <input
          onChange={handleChange("secondaryContactName")}
          type="text"
          className="form-control"
          value={secondaryContactName}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Secondary Contact Number</label>
        <input
          onChange={handleChange("secondaryContactNumber")}
          type="text"
          className="form-control"
          value={secondaryContactNumber}
        />
      </div>

      <h4>Shipping Information</h4>

      <div className="form-group">
        <label className="text-muted">Shipping Needed</label>
        <select
          onChange={handleChange("shippingNeeded")}
          className="form-control"
        >
          <option>Please select</option>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Address</label>
        <input
          onChange={handleChange("addressOne")}
          type="text"
          className="form-control"
          value={addressOne}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">City</label>
        <input
          onChange={handleChange("city")}
          type="text"
          className="form-control"
          value={city}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">State</label>
        <input
          onChange={handleChange("state")}
          type="text"
          className="form-control"
          value={state}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Country</label>
        <input
          onChange={handleChange("country")}
          type="text"
          className="form-control"
          value={country}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Zip Code</label>
        <input
          onChange={handleChange("zipCode")}
          type="text"
          className="form-control"
          value={zipCode}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Delivery Needed By</label>
        <input
          onChange={handleChange("deliveryTime")}
          type="datetime-local"
          className="form-control"
          value={deliveryTime}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Pickup Needed By</label>
        <input
          onChange={handleChange("pickupTime")}
          type="datetime-local"
          className="form-control"
          value={pickupTime}
        />
      </div>

      <h4>Additional Comments</h4>

      <div className="form-group">
        <label className="text-muted">Comments</label>
        <input
          onChange={handleChange("comments")}
          type="text"
          className="form-control"
          value={comments}
        />
      </div>
      <button className="btn btn-danger" onClick={back}>
        Back
      </button>
      <button className="btn btn-primary">Create Event</button>
    </div>
  );

  const formToggle = stateStep => {
    switch (stateStep) {
      case 1:
        return generalInfoStep();
      case 2:
        return shippingInfoStep();
      case 3:
        return commentStep();
      case 4:
        return confirmStep();
    }
  };

  const addEventFormContainer = () => (
    <form className="mb-3" onSubmit={clickSubmit}>
      {formToggle(step)}
    </form>
  );

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-info"
      style={{ display: createdEvent ? "" : "none" }}
    >
      <h2>{`${createdEvent}`} is created!</h2>
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-success">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <Layout
      title="Add a new event"
      description={`G'day ${user.name}, ready to add a new event?`}
    >
      <div className="row" style={{ marginTop: "50px" }}>
        <div className="col-md-8 offset-md-2">
          {showLoading()}
          {showSuccess()}
          {showError()}
          {addEventFormContainer()}
        </div>
      </div>
    </Layout>
  );
};

export default AddEvent;
