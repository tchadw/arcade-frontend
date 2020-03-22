import React, { Fragment, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import { useLocalState } from "../LocalStorageHook";
import { CartLockContext } from "../Routes";
import { itemTotal } from "./cartHelpers";
import { faHome, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#0099ff" };
  } else {
    return { color: "#000" };
  }
};

const Menu = ({ history }) => (
  <div>
    <ul className="nav nav-tabs menuItems">
      <li className="nav-item">
        <Link className="nav-link" style={isActive(history, "/")} to="/">
          <FontAwesomeIcon icon={faHome} />
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/shop")}
          to="/shop"
        >
          Shop
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link"
          style={isActive(history, "/cart")}
          to="/cart"
        >
          <FontAwesomeIcon icon={faShoppingCart} />{" "}
          <sup>
            <small className="badge badge-primary">{itemTotal()}</small>
          </sup>
        </Link>
      </li>

      {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/user/dashboard")}
            to="/user/dashboard"
          >
            Dashboard
          </Link>
        </li>
      )}

      {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <li className="nav-item">
          <Link
            className="nav-link"
            style={isActive(history, "/admin/dashboard")}
            to="/admin/dashboard"
          >
            Dashboard
          </Link>
        </li>
      )}

      {!isAuthenticated() && (
        <Fragment>
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signin")}
              to="/signin"
            >
              Signin
            </Link>
          </li>
          {/*
          <li className="nav-item">
            <Link
              className="nav-link"
              style={isActive(history, "/signup")}
              to="/signup"
            >
              Signup
            </Link>
          </li>
          */}
        </Fragment>
      )}

      {isAuthenticated() && (
        <li className="nav-item">
          <span
            className="nav-link"
            style={{ cursor: "pointer", color: "#000" }}
            onClick={() => [
              localStorage.setItem("eventSelected", null),
              localStorage.setItem("eventStartDate", null),
              localStorage.setItem("eventEndDate", null),
              localStorage.setItem("eventDeliveryTime", null),
              localStorage.setItem("eventPickupTime", null),
              localStorage.setItem("eventAddressOne", null),
              localStorage.setItem("eventCity", null),
              localStorage.setItem("eventState", null),
              localStorage.setItem("eventCountry", null),
              localStorage.setItem("eventZipCode", null),
              signout(() => {
                history.push("/");
              })
            ]}
          >
            Signout
          </span>
        </li>
      )}
      <li className="nav-item">
        <span
          className="nav-link"
          style={{
            color: "red",
            fontFamily: "Open Sans, sans-serif",
            fontSize: "10px"
          }}
        >
          Demo Version 1.0
        </span>
      </li>
    </ul>
  </div>
);

export default withRouter(Menu);
