import { useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../constants";

function ProductNewForm({ onProductCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { product_type_id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { name, description, product_type_id };

    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        onProductCreated(newProduct);
        setName(""); 
        setDescription("");
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (e) {
      console.log("Error creating product type:", e);
    }
  };

  return (
    <div className="card">
      <u> New Product Form </u>
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

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
}

export default ProductNewForm;