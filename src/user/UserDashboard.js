import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getPurchaseHistory, getEventHistory } from "./apiUser";
import moment from "moment";

const Dashboard = () => {
  const [history, setHistory] = useState([]);

  const [eventHistory, setEventHistory] = useState([]);

  const {
    user: { _id, name, email, role }
  } = isAuthenticated();
  const token = isAuthenticated().token;

  const init = (userId, token) => {
    getPurchaseHistory(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setHistory(data);
      }
    });
    getEventHistory(userId, token).then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        setEventHistory(data);
      }
    });
  };

  useEffect(() => {
    init(_id, token);
  }, []);

  const userLinks = () => {
    return (
      <div className="card">
        <h4 className="card-header">User Links</h4>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart">
              My Cart
            </Link>
          </li>
          <li className="list-group-item">
            <Link
              className="nav-link"
              to={`/profile/${_id}`}
              style={{ pointerEvents: "none", opacity: "0.6" }}
            >
              Update Profile (Pro Version Only)
            </Link>
          </li>
          <li className="list-group-item">
            <Link
              className="nav-link"
              to={`/event/create/${_id}`}
              style={{ pointerEvents: "none", opacity: "0.6" }}
            >
              Create Event (Pro Version Only)
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h4 className="card-header">User Information</h4>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === 1 ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = history => {
    return (
      <div className="card mb-5">
        <h4 className="card-header">Purchase history</h4>
        <ul className="list-group">
          <li className="list-group-item">
            {history.map((h, i) => {
              return (
                <div>
                  <hr />
                  {h.products.map((p, i) => {
                    return (
                      <div key={i}>
                        <p>Product name: {p.name}</p>
                        <p>Product price: ${p.price}</p>
                        <p>Purchased date: {moment(p.createdAt).fromNow()}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    );
  };

  const eventHistoryList = eventHistory => {
    return (
      <div className="card mb-5">
        <h4 className="card-header">Event history</h4>
        <ul className="list-group">
          <li className="list-group-item">
            {eventHistory.map((h, i) => {
              return (
                <div>
                  <hr />
                  <div key={i}>
                    <h5>{h.eventName}</h5>
                    <p>Primary contact: {h.primaryContactName}</p>
                    <p>
                      Start date: {moment(h.startDate).format("MMM DD, YYYY")}
                    </p>
                    <p>End date: {moment(h.endDate).format("MMM DD, YYYY")}</p>
                  </div>
                </div>
              );
            })}
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Layout
      title="Dashboard"
      description={`G'day ${name}!`}
      className="container-fluid"
    >
      <div className="row" style={{ marginTop: "50px" }}>
        <div className="col-12">
          <h1>Customer Dashboard</h1>
        </div>
      </div>
      <div className="row" style={{ marginTop: "50px" }}>
        <div className="col-lg-5">{userLinks()}</div>
        <div className="col-lg-7">
          {userInfo()}
          {purchaseHistory(history)}
          {eventHistoryList(eventHistory)}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
