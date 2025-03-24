import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <>
      <h1> Marcus </h1>
      <Link to="/product_types">
        Public
      </Link>
      { " | "}
      <Link to="/private/product_types">
        Private
      </Link>
    </>
  )
}

export default Landing;