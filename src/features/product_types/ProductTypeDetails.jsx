import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../constants";
import ProductsTable from "../products/ProductsTable"


function ProductTypeDetails({productTypeId = null}){
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState(null);

  const { product_type_id } = useParams();

  useEffect( () => {
    fetchProductType();
  }, []);

  const fetchProductType = async () => {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id || productTypeId}.json`);
      if (response.ok){
        const json = await response.json();
        setProductType(json);
        setLoading(false);
      }
      else
        throw response;
    } catch(e){
      console.log("Error...", e);
    }
  };  

  if (loading) return <h2> Loading... </h2>;

  return(
    <>
    <h1> Product Types </h1>
    <div className="card">
      <h2>{productType.name}</h2>
      <p>{productType.description}</p>
    </div>
    <ProductsTable productTypeId = {productType.id} />
    <Link to="/private/product_types">
      ← Back to Product Types
    </Link>
    </>
  )
}

export default ProductTypeDetails;