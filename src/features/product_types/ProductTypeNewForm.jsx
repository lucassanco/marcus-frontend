import { useState } from "react";
import { API_URL } from "../../constants";

function ProductTypeNewForm({ onProductTypeCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = { name, description };

    const response = await fetch(`${API_URL}/product_types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const newProductType = await response.json();
      onProductTypeCreated(newProductType);
      setName("");
      setDescription("");
    } else {
      const errorText = await response.text();
      console.log(errorText);
    }
  };

  return (
    <div className="card">
      <u> Product Type Form </u>
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
          <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default ProductTypeNewForm;
