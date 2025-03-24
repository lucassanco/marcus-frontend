import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../constants";
import { FaEye } from "react-icons/fa";

function PublicProductTypesTable() {
  const [product_types, setProductTypes] = useState([]);

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

  return (
    <div>
      <h1> Product types </h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {product_types.map((product_type) => (
            <tr key={product_type.id}>
              <th scope="row">
                <strong>{product_type.name}</strong>
              </th>
              <td>{product_type.description}</td>
              <td>
                <Link to={`/product_types/${product_type.id}/products`}>
                    <FaEye size={24}/>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/">
        ← Back to Landing
      </Link>
    </div>
  );
}

export default PublicProductTypesTable;
