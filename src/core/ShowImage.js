import React from "react";
import { API } from "../config";

const ShowImage = ({ item, url }) => (
  <div
    className="product-img"
    style={{
      textAlign: "center"
    }}
  >
    <img
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      className="mb-3"
      style={{
        width: "300px",
        height: "300px",
        objectFit: "scale-down"
      }}
    />
  </div>
);

export default ShowImage;
