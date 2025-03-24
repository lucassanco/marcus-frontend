import { useEffect, useState } from "react";
import { API_URL } from "../../constants";
import { useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function ProductOptionEdit() {
  const [initialName, setInitialName] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [optionValues, setOptionValues] = useState([]);

  const { product_type_id, product_id, option_id } = useParams();

  useEffect(() => {
    fetchProductOption();
  }, [])

  async function fetchProductOption() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/options/${option_id}.json`);
      if (response.ok) {
        const json = await response.json();
        setName(json.name);
        setInitialName(json.name);
        setOptionValues(json.values);
        setLoading(false);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error...", e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/options/${option_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newProductOption = await response.json();
        setName(newProductOption.name);
        setInitialName(newProductOption.name);
        setOptionValues(newProductOption.values);
        setLoading(false);
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (e) {
      console.log("Error creating product type:", e);
    }
  };

  const handleAddOptionValue = () => {
    setOptionValues([...optionValues, { name: "" }]);
  };
  

  const handleOptionValueNameChange = (index, newName) => {
    const newOptionValues = [...optionValues];
    newOptionValues[index].name = newName;
    setOptionValues(newOptionValues);
  };
  
  const handleOptionValueStockChange = (index, newStock) => {
    const newOptionValues = [...optionValues];
    newOptionValues[index].stock_count = newStock;
    setOptionValues(newOptionValues);
  };


  const handleRemoveOptionValue = (index) => {
    const newOptionValues = [...optionValues];
    if (newOptionValues[index].id)
      newOptionValues[index]._destroy = true;
    else
      newOptionValues.splice(index, 1);
    setOptionValues(newOptionValues);
  };
  

  if(loading) return <h3> Loading.. </h3>;

  return (
    <>
      <h1> {initialName} </h1>
      <form onSubmit={handleSubmit} className="card">
        <label htmlFor="nameInput">Name</label>
        <input
          id="nameInput"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {
        optionValues
          .map((option_value, index) => (
            option_value._destroy ? null : (
              <div className="form-group inline" key={option_value.id || `new-${index}`}>
                <label htmlFor={`option_value_${index}_name`}>
                  Name #{index + 1}
                </label>
                <input
                  id={`option_value_${index}_name`}
                  type="text"
                  name={`product_option_values[${index}][name]`}
                  value={option_value.name}
                  onChange={(e) => handleOptionValueNameChange(index, e.target.value)}
                  required
                />

                <label htmlFor={`option_value_${index}_stock`}>
                  Stock #{index + 1}
                </label>
                <input
                  id={`option_value_${index}_stock`}
                  type="number"
                  name={`product_option_values[${index}][stock_count]`}
                  value={optionValues[index].stock_count}
                  onChange={(e) => handleOptionValueStockChange(index, e.target.value)}
                  required
                />
                <FaTrashAlt
                  size={24}
                  onClick={() => handleRemoveOptionValue(index)}
                  style={{ cursor: "pointer", color: "red" }}
                />
              </div>
            )
        ))}

        <button type="button" onClick={() => handleAddOptionValue()}>
          + option value
        </button>

        <button type="submit" >
          Update Product Option
        </button>
      </form>
      <Link to={`/private/product_types/${product_type_id}/products/${product_id}/edit`}>
        ← Back to Product
      </Link>
    </>
  );
}

export default ProductOptionEdit;
