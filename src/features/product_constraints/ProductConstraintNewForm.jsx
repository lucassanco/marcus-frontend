import { useEffect, useState } from "react";
import { API_URL } from "../../constants";
import { useParams } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

function ProductConstraintNewForm({ onProductConstraintCreated, initialOptions}) {
  const [productOptions, setProductOptions] = useState(initialOptions);
  const [loading, setLoading] = useState(true);

  const [option1Id, setOption1Id] = useState(null);
  const [option2Id, setOption2Id] = useState(null);
  const [value1Id, setValue1Id] = useState(null);
  const [allowedValues, setAllowedValues] = useState([]);

  const { product_type_id, product_id } = useParams();

  useEffect( () => {
    fetchProductOptions();
  }, [initialOptions])

  async function fetchProductOptions() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/options.json`);
      if (response.ok) {
        const json = await response.json();
        setProductOptions(json);
        setLoading(false);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error...", e);
    }
  }  

  const handleOption1IdChanged = (newOption1Id) => {
    setOption1Id(newOption1Id);
  }

  const handleOption2IdChanged = (newOption2Id) => {
    setOption2Id(newOption2Id);
  }

  const handleValue1IdChanged = (newValue1Id) => {
    setValue1Id(newValue1Id);
  }

  const handleAllowedValueChanged = (checkbox) => {
    const { value, checked } = checkbox.target;

    const id = parseInt(value);

    if (checked) {
      setAllowedValues((prev) => [...prev, id]);
    } else {
      setAllowedValues((prev) => prev.filter((v) => v !== id));
    }
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      product_constraint: {
        option_1_id: option1Id,
        option_2_id: option2Id,
        value_1_id: value1Id,
        allowed_value_ids: allowedValues,
        product_id: product_id
      }
    };

    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/constraints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newConstraint = await response.json();
        onProductConstraintCreated(newConstraint);
        setOption1Id(null);
        setOption2Id(null);
        setValue1Id(null);
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (e) {
      console.log("Error creating product type:", e);
    }
  };

  if (loading) return <h2> Loading... </h2>;

  return (
    <div className="card">
      <u> Product Constraint Form </u>
      <form onSubmit={handleSubmit}>
        <label htmlFor='constrainer_select'>
          Constrainer option:
        </label>
        <select
          id='constrainer_select'
          value={option1Id || ""}
          onChange={(e) => handleOption1IdChanged(parseInt(e.target.value))}
        >
          <option value="">Select an option</option>
          {
            productOptions.map((option) => (
              <option 
                key={option.id}
                value={option.id}
              >
                {option.name}
              </option>
            ))
          }
        </select>

        <label htmlFor='constrainee_select'>
          Constrainee option:
        </label>
        <select
          id='constrainee_select'
          value={option2Id || ""}
          onChange={(e) => handleOption2IdChanged(parseInt(e.target.value))}
        >
          <option value="">Select an option</option>
          {
            productOptions
            .filter((option) => (option.id != option1Id))
            .map((option) => (
              <option 
                key={option.id}
                value={option.id}
              >
                {option.name}
              </option>
            ))
          }
        </select>  

        <label htmlFor='value_1_select'>
          If constrainer is:
        </label>
        <select
          id='value_1_select'
          value={value1Id || ""}
          onChange={(e) => handleValue1IdChanged(parseInt(e.target.value))}
        >
          <option value="">Select an option</option>
          {
            productOptions.find(option => option.id === option1Id)?.values?.map((value) => (
              <option 
                key={value.id}
                value={value.id}
              >
                {value.name}
              </option>
            ))
          }
        </select>

        <div>
        {
          option2Id ? (
            <>
              <p>
                Then the allowed values for {productOptions.find(option => option.id === option2Id)?.name} are (Uncheck all to make it unavailable):
              </p>
              {productOptions.find(option => option.id === option2Id)?.values?.map((value) => (
                <div className="form-group inline" key={`group_${value.id}`}>
                  <label htmlFor={`checkbox_${value.id}`}>{value.name}</label>
                  <input
                    type="checkbox"
                    value={value.id}
                    onChange={handleAllowedValueChanged}
                    checked={allowedValues.includes(value.id)}
                  />
                </div>
              ))}
            </>
          ) : (
            <p style={{ fontStyle: "italic", color: "#aaa" }}>
              Select a constrainee to show options here
            </p>
          )
        }
        </div>
        
        <div className="form-submit">
          <button type="submit">
            Create Constraint
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductConstraintNewForm;
