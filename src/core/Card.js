import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { CartLockContext } from "../Routes";
import ShowImage from "./ShowImage";
import moment from "moment";
import { addItem, updateItem, removeItem } from "./cartHelpers";

import { faCartPlus, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = false,
  cartUpdate = false,
  showRemoveProductButton = false
}) => {
  const cartLockerContext = useContext(CartLockContext);

  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);
  const [activeCart, setActiveCart] = useState(false);

  const showViewButton = showViewProductButton => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn mt-2 mb-2 btn-lg">
            <FontAwesomeIcon icon={faInfoCircle} />
          </button>
        </Link>
      )
    );
  };

  const addToCart = () => {
    addItem(product, () => {
      setRedirect(true);
    });
  };

  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showDimAddToCart = showDimAddToCartButton => {
    return (
      showDimAddToCartButton && (
        <button onClick={addToCart} className="btn mt-2 mb-2 btn-lg" disabled>
          <FontAwesomeIcon icon={faCartPlus} />
        </button>
      )
    );
  };

  const showAddToCart = showAddToCartButton => {
    return (
      showAddToCartButton && (
        <button onClick={addToCart} className="btn mt-2 mb-2 btn-lg">
          <FontAwesomeIcon icon={faCartPlus} />
        </button>
      )
    );
  };

  const showRemoveButton = showRemoveProductButton => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => removeItem(product._id)}
          className="btn btn-danger mt-2 mb-2"
        >
          Remove Product
        </button>
      )
    );
  };

  const showStock = quantity => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill"></span>
    ) : (
      <span className="badge badge-primary badge-pill">Out of Stock</span>
    );
  };

  const handleChange = productId => event => {
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = cartUpdate => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              className="form-control"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  return (
    <div className="card border-light">
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        <div className="itemCardText">{product.name}</div>
        <br />
        <p>${product.hourlyPrice} /hour</p>
        <p>${product.dailyPrice} /day</p>
        {showStock(product.quantity)}
        <br />

        {showViewButton(showViewProductButton)}

        {showAddToCart(showAddToCartButton)}

        {showRemoveButton(showRemoveProductButton)}

        {showCartUpdateOptions(cartUpdate)}
      </div>
    </div>
  );
};

export default Card;
