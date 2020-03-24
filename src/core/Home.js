import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { Link } from "react-router-dom";

import Jumbotron from "react-bootstrap/Jumbotron";

import enter_2 from "../images/home/enter_2.png";
import add_2 from "../images/home/add_2.png";
import pay from "../images/home/pay.png";
import slider_1 from "../images/home/slider_1.jpg";

const Home = () => {
  useEffect(() => {}, []);

  return (
    <Layout title="Home Page" description="Node React E-commerce App" fluid>
      <div
        id="carouselExampleSlidesOnly"
        class="carousel slide"
        data-ride="carousel"
      >
        <div class="carousel-inner text-center">
          <div class="carousel-item active">
            <img src={slider_1} class="d-block w-100" alt="Pink Arcade" fluid />
            <div class="carousel-caption d-flex h-100 align-items-center justify-content-center">
              <h1
                style={{ fontSize: "550%", textShadow: "3px 3px #000" }}
                fluid
              >
                RENT&PLAY
              </h1>
              <br />
            </div>
          </div>
        </div>
      </div>
      <Jumbotron
        fluid
        className="text-center"
        style={{
          backgroundColor: "white",
          marginTop: "50px"
        }}
      >
        <div>
          <h1>Arcade Game Rentals Made Easy</h1>
          <p>Rent an arcade game with three easy steps!</p>
        </div>
      </Jumbotron>

      <div class="row mt-1 mb-5">
        <div class="col-md-4 text-center mt-4 mb-4">
          <img
            src={enter_2}
            alt="Enter"
            className="card-img-top"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "scale-down"
            }}
          />
          <div class="card-body">
            <h5 class="card-title">Step 1</h5>
            <p class="card-text">Fill out all your rental information.</p>
          </div>
        </div>
        <div class="col-md-4 text-center mt-4 mb-4">
          <img
            src={add_2}
            alt="Enter"
            className="card-img-top"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "scale-down"
            }}
          />
          <div class="card-body">
            <h5 class="card-title">Step 2</h5>
            <p class="card-text">
              Browse our inventory and add what you need to your cart.
            </p>
          </div>
        </div>
        <div class="col-md-4 text-center mt-4 mb-4">
          <img
            src={pay}
            alt="Enter"
            className="card-img-top"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "scale-down"
            }}
          />
          <div class="card-body">
            <h5 class="card-title">Step 3</h5>
            <p class="card-text">
              Finally, checkout and pay for all your rental items.
            </p>
          </div>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col" style={{ textAlign: "center" }}>
          <Link to="/shop">
            <button className="btn btn-lg btn-primary">View Inventory</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
