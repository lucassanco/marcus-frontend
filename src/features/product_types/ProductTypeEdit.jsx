import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../constants";
import ProductsTable from "../products/ProductsTable"
import ProductNewForm from "../products/ProductNewForm"

function ProductTypeEdit() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const[products, setProducts] = useState([]);

  const { product_type_id } = useParams();

  useEffect(() => {
    fetchProductType();
    fetchProducts();
  }, []);

  const fetchProductType = async () => {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}.json`);
      if (response.ok) {
        const json = await response.json();
        setName(json.name);
        setDescription(json.description);
        setLoading(false);
      } else throw response;
    } catch (e) {
      console.log("Error...", e);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products.json`);
      if (response.ok) {
        const json = await response.json();
        setProducts(json);
        setLoading(false);
      } else throw response;
    } catch (e) {
      console.log("Error...", e);
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = { name, description };

    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success("Product type updated successfully!");
      } else {
        const errorText = await response.text();
        toast.error(`Update failed: ${errorText}`);
      }
    } catch (e) {
      console.log("Error updating product type...", e);
      toast.error("Something went wrong while updating.");
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
    <h1> Product Types </h1>
    <div className="card">
      <form onSubmit={handleSubmit}>
          <label htmlFor="nameInput">Name</label>
          <input
            id="nameInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="descriptionInput">Description</label>
          <textarea
            id="descriptionInput"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Save</button>
      </form>
    </div>

    <hr></hr>
    <ProductNewForm onProductCreated={handleProductCreated}/>
    <ProductsTable initialProducts = {products}/>

    <Link to={`/private/product_types`}>
      ← Back to Product Types
    </Link>
    </>
  );
}

export default ProductTypeEdit;
