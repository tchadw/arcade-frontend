import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

const NotSignedIn = () => {
  return (
    <div class="card">
      <h5 class="card-header">Attention User</h5>
      <div class="card-body">
        <h5 class="card-title">You Are Not Signed In</h5>
        <p class="card-text">
          In order to successfully add items to your cart, you must sign into
          your account.
        </p>
        <Link className="btn btn-primary buttonText" to="/signin">
          Signin
        </Link>
      </div>
    </div>
  );
};

export default NotSignedIn;
