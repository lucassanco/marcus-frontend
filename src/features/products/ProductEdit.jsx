import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../../constants";

import ProductOptionNewForm from "../product_options/ProductOptionNewForm";
import ProductOptionsTable from "../product_options/ProductOptionsTable"

import ProductConstraintNewForm from "../product_constraints/ProductConstraintNewForm"
import ProductConstraintsTable from "../product_constraints/ProductConstraintsTable";
import ProductEditForm from "./ProductEditForm";


function ProductEdit(){
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [options, setOptions] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  const [constraints, setConstraints] = useState(null);
  const [loadingConstraints, setLoadingConstraints] = useState(true);
  
  const { product_type_id, product_id} = useParams();

  useEffect(() => {
    fetchProduct();
    fetchProductOptions();
    fetchProductConstraints();
  }, []);

  async function fetchProduct() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}.json`);
      if (response.ok){
        const json = await response.json();
        setProduct(json);
        setLoadingProduct(false);
      }
      else
        throw response;
    } catch(e){
      console.log("Error...", e);
    }
  };

  async function fetchProductOptions() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/options.json`);
      if (response.ok) {
        const json = await response.json();
        setOptions(json);
        setLoadingOptions(false);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error...", e);
    }
  }

  async function fetchProductConstraints() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/constraints.json`);
      if (response.ok) {
        const json = await response.json();
        setConstraints(json);
        setLoadingConstraints(false);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error...", e);
    }
  }

  const handleProductEdited = (newProduct) => {
    setProduct(newProduct);
  };


  const handleOptionCreated = (newOption) => {
    setOptions((prev) => [...prev, newOption]);
  };

  const handleOptionDeleted = (oldOption) => {
    setOptions((prev) => prev.filter(opt => opt.id !== oldOption.id));
  };

  const handleConstraintCreated = (newConstraint) => {
    setConstraints((prev) => [...prev, newConstraint]);
  };

  if(loadingProduct || loadingOptions || loadingConstraints) return (<h2> Loading... </h2>)

  return (
    <>
      <h1> {product.name} </h1>
      <ProductEditForm product={product} onProductEdited={handleProductEdited}/>
      <hr></hr>
      <h2> Options </h2>
      <ProductOptionNewForm onProductOptionCreated = { handleOptionCreated } />
      <ProductOptionsTable initialOptions = {options} onProductOptionDeleted = { handleOptionDeleted } />
      
      <hr></hr>
      <h2> Constraints </h2>
      <ProductConstraintNewForm onProductConstraintCreated = { handleConstraintCreated } initialOptions = {options} />
      <ProductConstraintsTable initialConstraints = {constraints} />

      <Link to={`/private/product_types/${product_type_id}`}>
        ← Back to Products
      </Link>
    </>
  );
}

export default ProductEdit;