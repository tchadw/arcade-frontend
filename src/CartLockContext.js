import React, { useState, useReducer } from "react";

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

export const CartLockProvider = props => {
  const [locker, dispatch] = useReducer(reducer, initialState);
  return (
    <CartLockContext.Provider
      value={{ cartLockerState: locker, cartLockerDispatch: dispatch }}
    >
      {props.children}
    </CartLockContext.Provider>
  );
};
