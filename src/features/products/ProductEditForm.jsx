import { useState } from "react";
import { API_URL } from "../../constants";
import { useParams } from "react-router-dom";

function ProductEditForm({ product, onProductEdited}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);

  const {product_type_id, product_id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = { name, description };

    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        setName(newProduct.name);
        setDescription(newProduct.description);
        onProductEdited(newProduct);
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (e) {
      console.log("Error creating product type:", e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
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

      <button type="submit">Edit </button>
    </form>
  );
}

export default ProductEditForm;
