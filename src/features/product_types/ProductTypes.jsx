import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../constants.js";
import ProductTypeNewForm from "./ProductTypeNewForm.jsx";
import ProductTypesTable from "./ProductTypesTable.jsx"

function ProductTypes() {
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    fetchProductTypes();
  }, []);

  async function fetchProductTypes() {
    try {
      const response = await fetch(`${API_URL}/product_types.json`);
      if (response.ok) {
        const json = await response.json();
        setProductTypes(json);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error...", e);
    }
  }

  const handleProductTypeCreated = (newProductType) => {
    setProductTypes((prev) => [...prev, newProductType]);
  };

  return (
    <>
      <h1> Product Types </h1>
      <ProductTypeNewForm onProductTypeCreated={handleProductTypeCreated} />
      <ProductTypesTable initialProductTypes = {productTypes} />
      <Link to="/">
        ← Back to Landing
      </Link>
    </>
  );
}

export default ProductTypes;
