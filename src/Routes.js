import React, { useReducer, useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Home from "./core/Home";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "./user/UserDashboard";
import AdminRoute from "./auth/AdminRoute";
import UserRoute from "./auth/UserRoute";
import AdminDashboard from "./user/AdminDashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Shop from "./core/Shop";
import Product from "./core/Product";
import Cart from "./core/Cart";
import Orders from "./admin/Orders";
import Profile from "./user/Profile";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import AddEvent from "./user/AddEvent";
import { EventContext } from "./EventContext";

export const CartLockContext = React.createContext();

const initialState = {
  cartLock: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "lock":
      return { cartLock: false };
    case "unlock":
      return { cartLock: true };
    default:
      return state;
  }
};

const Routes = () => {
  const [locker, dispatch] = useReducer(reducer, initialState);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/shop" exact>
          <CartLockContext.Provider
            value={{ cartLockerState: locker, cartLockerDispatch: dispatch }}
          >
            <EventContext.Provider>
              <Shop />
            </EventContext.Provider>
          </CartLockContext.Provider>
        </Route>
        <Route path="/signin" exact component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
        <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
        <AdminRoute path="/create/category" exact component={AddCategory} />
        <AdminRoute path="/create/product" exact component={AddProduct} />
        <Route path="/product/:productId" exact component={Product} />
        <Route path="/cart" exact>
          <CartLockContext.Provider
            value={{ cartLockerState: locker, cartLockerDispatch: dispatch }}
          >
            <Cart />
          </CartLockContext.Provider>
        </Route>
        <AdminRoute path="/admin/orders" exact component={Orders} />
        <PrivateRoute path="/profile/:userId" exact component={Profile} />
        <PrivateRoute path="/admin/products" exact component={ManageProducts} />
        <AdminRoute path="/admin/products" exact component={ManageProducts} />
        <AdminRoute
          path="/admin/product/:productId/:userId"
          exact
          component={UpdateProduct}
        />
        <UserRoute path="/event/create/:userId" exact component={AddEvent} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
