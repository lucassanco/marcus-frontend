import { useState } from "react";
import { API_URL } from "../../constants";
import { useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

function ProductOptionNewForm({ onProductOptionCreated }) {
  const [name, setName] = useState("");
  const [optionValues, setOptionValues] = useState([]);

  const { product_type_id, product_id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const postData = {
      product_option: {
        name,
        product_id,
        product_option_values_attributes: optionValues.map((value) => {
          const payload = {
            name: value.name,
            stock_count: value.stock_count,
            _destroy: value._destroy || false
          };
        
          if (value.id) {
            payload.id = value.id;
          }
        
          return payload;
        })
      }
    };

    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newProductOption = await response.json();
        onProductOptionCreated(newProductOption);
        setName("");
        setOptionValues([]);
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (e) {
      console.log("Error creating product type:", e);
    }
  };

  const handleAddOptionValue = () => {
    const newOptionValues = ([...optionValues, {}]);
    setOptionValues(newOptionValues);
  };

  const handleOptionValueChange = (index, value) => {
    const newOptionValues = [...optionValues];
    newOptionValues[index].name = value;
    setOptionValues(newOptionValues);
  };

  const handleRemoveOptionValue = (index) => {
    const newOptionValues = optionValues.filter((_, i) => i !== index);
    setOptionValues(newOptionValues);
  };

  const handleOptionValueStockChange = (index, newStock) => {
    const newOptionValues = [...optionValues];
    newOptionValues[index].stock_count = newStock;
    setOptionValues(newOptionValues);
  };

  return (
    <div className="card">
      <u> Product Option Form </u>
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="nameInput">Name</label>
        <input
          id="nameInput"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {
        optionValues.map((value, index) => (
          <div className="form-group inline" key={index}>
            <label htmlFor={`option_value_${index}`}>
              Option Value #{index + 1}
            </label>
            <input
              id={`option_value_${index}`}
              type="text"
              name={`product_option_values[${index}]`}
              value={value.name || ""}
              onChange={(e) => handleOptionValueChange(index, e.target.value)}
            />
            <label htmlFor={`option_value_${index}_stock`}>
              Stock #{index + 1}
            </label>
            <input
              id={`option_value_${index}_stock`}
              type="number"
              name={`product_option_values[${index}][stock_count]`}
              value={value.stock_count || 0}
              onChange={(e) => handleOptionValueStockChange(index, e.target.value)}
              required
            />
            <FaTrashAlt size={24}
              onClick={() => handleRemoveOptionValue(index)}
              style={{ cursor: "pointer", color: "red" }}
            />
          </div>
            ))
        }
        <button type="button" onClick={() => handleAddOptionValue(optionValues.length)}>
          + option value
        </button>

        <button type="submit" >
          Create Product Option
        </button>
      </form>
    </div>
  );
}

export default ProductOptionNewForm;
