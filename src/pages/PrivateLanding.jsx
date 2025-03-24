import React from "react";
import { Link } from "react-router-dom";

function PrivateLanding() {
  return (
    <>
      <div>
        <h1> Private </h1>
        <Link to="/private/product_types">
          Product Types
        </Link>
        { " | "}
        <Link to="/private/product_options">
          Product Options
        </Link>
      </div>
      <div>
        <Link to="/">
          ← Back to Landing
        </Link>
      </div>
    </>
  )
}

export default PrivateLanding;