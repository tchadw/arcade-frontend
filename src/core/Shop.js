import React, { useState, useEffect, useContext } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { Link, withRouter } from "react-router-dom";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import EventPicker from "./EventPicker";
import NotSignedIn from "./NotSignedIn";
import { prices } from "./fixedPrices";
import { EventContext } from "../EventContext";
import { CartLockContext } from "../Routes";

const Shop = () => {
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] }
  });

  const cartLockerContext = useContext(CartLockContext);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(0);
  const [filteredResults, setFilteredResults] = useState([]);
  const [catDropDown, setCatDropDown] = useState(false);
  const [priceDropDown, setPriceDropDown] = useState(false);
  const [activeCart, setActiveCart] = useState(false);

  const context = useContext(EventContext);

  const init = () => {
    getCategories().then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setCategories(data);
      }
    });
  };

  const loadFilteredResults = newFilters => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    // console.log(newFilters);
    getFilteredProducts(toSkip, limit, myFilters.filters).then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          Load more
        </button>
      )
    );
  };

  useEffect(() => {
    init();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("eventSelected") === "" ||
      localStorage.getItem("eventSelected") === null
    ) {
      setActiveCart(false);
    } else {
      setActiveCart(true);
    }
  });

  const handleFilters = (filters, filterBy) => {
    // console.log("SHOP", filters, filterBy);
    const newFilters = { ...myFilters };
    newFilters.filters[filterBy] = filters;

    if (filterBy === "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    setMyFilters(newFilters);
  };

  const handlePrice = value => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };

  function toggleDropDownState(currDrop) {
    return currDrop ? false : true;
  }

  const signInCheck = () => {
    if (localStorage.getItem("jwt") === null) {
      return <NotSignedIn />;
    }
    return <EventPicker event={context} />;
  };

  return (
    <Layout
      title="Shop Page"
      description="Search and find books of your choice"
      className="container-fluid"
    >
      <div className="row" style={{ marginTop: "50px" }}>
        <div className="col-sm-4">
          <h1 style={{ textAlign: "center" }}>Inventory</h1>
          <br />
          <button
            type="button"
            class="btn btn-light col-sm buttonText"
            onClick={() => setCatDropDown(toggleDropDownState(catDropDown))}
          >
            Filter By Type
          </button>
          <ul>
            {catDropDown ? (
              <Checkbox
                categories={categories}
                handleFilters={filters => handleFilters(filters, "category")}
              />
            ) : null}
          </ul>

          {/* 
          <button
            type="button"
            class="btn btn-light col-sm buttonText"
            onClick={() => setPriceDropDown(toggleDropDownState(priceDropDown))}
          >
            Price Range
          </button>
          */}
          <div>
            {priceDropDown ? (
              <RadioBox
                prices={prices}
                handleFilters={filters => handleFilters(filters, "price")}
              />
            ) : null}
          </div>
          <br />

          {signInCheck()}
        </div>

        <div className="col-sm">
          <div className="row">
            {filteredResults.map((product, i) => (
              <div key={i} className="col-sm mb-3 ">
                <Card
                  product={product}
                  showAddToCartButton={
                    cartLockerContext.cartLockerState.cartLock
                  }
                />
              </div>
            ))}
          </div>
          <hr />
          {loadMoreButton()}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
