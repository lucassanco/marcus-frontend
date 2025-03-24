import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../../constants";
import { FaExternalLinkAlt } from "react-icons/fa";

function PublicProductsTable() {
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingProductType, setLoadingProductType] = useState(true);
  const [productType, setProductType] = useState(null);
  const [products, setProducts] = useState([]);

  const { product_type_id } = useParams();

  useEffect(() => {
    fetchProducts();
    fetchProductType();
  }, []);

  async function fetchProductType() {
    try {
      const url = `${API_URL}/product_types/${product_type_id}`

      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        setProductType(json);
        setLoadingProductType(false);
      } else throw response;
    } catch (e) {
      console.log("Error fetching products...", e);
    }
  }

  async function fetchProducts() {
    try {
      const url = `${API_URL}/product_types/${product_type_id}/products`

      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        setProducts(json);
        setLoadingProducts(false);
      } else throw response;
    } catch (e) {
      console.log("Error fetching products...", e);
    }
  }

  return (
    <div>
      {
        loadingProductType ? 
          <h2>Loading product type...</h2> : 
          <h2> {productType.name} products</h2>
      }
      {
        loadingProducts ? 
          <h3>Loading products...</h3> : 
          <table className="styled-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>This product type has no products yet!</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">
                    <strong>{product.name}</strong>
                  </th>
                  <td>{product.description}</td>
                  <td>
                    <Link to={`/product_types/${product_type_id}/products/${product.id}`}>
                      Customize
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      }
      <Link to="/product_types">
        ← Back to Product Types
      </Link>      
    </div>
  );
}

export default PublicProductsTable;
