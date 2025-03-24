import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../../constants";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

function PublicProductDetails(){
  const [product, setProduct] = useState(null);
  const [productOptions, setProductOptions] = useState(null);
  const [productOptionValues, setProductOptionValues] = useState({});
  const [productConstraints, setProductConstraints] = useState([]);
  
  const [selectedOptions, setSelectedOptions] = useState({});
  const [disabledOptions, setDisabledOptions] = useState({});
  const [constraintMessages, setConstraintMessages] = useState({});
  
  const [loading, setLoading] = useState(true);

  const { product_type_id, product_id } = useParams();

  const { addItem } = useCart();

  useEffect(() => {
    async function fetchData() {
      await fetchProduct();
      await fetchProductOptions();
    }
    fetchData();
  }, []);
  
  useEffect(() => {
    if (productOptions) {
      fetchAllProductOptionValues();
      fetchProductConstraints();
      setLoading(false);
    }
  }, [productOptions]);

  async function fetchProduct() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}.json`);
      if (response.ok){
        const json = await response.json();
        setProduct(json);
      }
      else
        throw response;
    } catch(e){
      console.log("Error...", e);
    }
  };

  async function fetchProductOptions() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/options.json`);
      if (response.ok){
        const json = await response.json();
        setProductOptions(json);
      }
      else
        throw response;
    } catch(e){
      console.log("Error...", e);
    }
  };

  async function fetchAllProductOptionValues() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/option_values.json`);
      if (response.ok) {
        const json = await response.json();
        const groupedByOptionId = json.reduce((acc, value) => {
          const key = value.product_option_id;
          if (!acc[key]) acc[key] = [];
          acc[key].push(value);
          return acc;
        }, {});
        setProductOptionValues(groupedByOptionId);        
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error fetching values for option", productOption.id, e);
    }
  }

  async function fetchProductConstraints() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/constraints.json`);
      if (response.ok) {
        const json = await response.json();
        setProductConstraints(json);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error fetching constraints...", e);
    }
  }

  const handleOptionChange = (optionId, selectedValueId) => {
    const newSelectedOptions = { ... selectedOptions, [optionId]: selectedValueId }
    const newDisabledOptions = {  }
    const newConstraintMessages = { }

    productConstraints.forEach( (constraint) => {
      if(newSelectedOptions[constraint.option_1_id] == constraint.value_1_id) {
        // option selected is constrainer
        const affectedOptionId = constraint.option_2_id;
        const allowedValues = new Set(constraint.allowed_value_ids);

        newDisabledOptions[affectedOptionId] = (productOptionValues[affectedOptionId] || [])
          .filter((value) => !allowedValues.has(value.id))
          .map((value) => value.id);

        if (newSelectedOptions[affectedOptionId] && !allowedValues.has(newSelectedOptions[affectedOptionId]))
          delete newSelectedOptions[affectedOptionId];

        if(allowedValues.size == 0)
          newConstraintMessages[affectedOptionId] = `${constraint.option_2_name} is not customizable due to selected ${constraint.option_1_name}.`;
        else
          newConstraintMessages[affectedOptionId] = `Some options are disabled due to the selected "${constraint.option_1_name}".`;
      }
    });
    
    setSelectedOptions(newSelectedOptions);
    setDisabledOptions(newDisabledOptions);
    setConstraintMessages(newConstraintMessages);
  };

  const handleAddToCart = async () => {
    const postData = {
      cart_item: {
        product_id,
        customized_options_attributes: Object.entries(selectedOptions).map(([optionId, valueId]) => ({
          product_option_id: optionId,
          product_option_value_id: valueId
        }))
      }
    };

    try {
      const response = await fetch(`${API_URL}/cart_items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newCartitem = await response.json();
        addItem(newCartitem);
        toast.success('Item added to cart!');
      } else {
        const errorText = await response.text();
        const parsedError = JSON.parse(errorText);
        const errorMessage = parsedError.errors;
        toast.error(errorMessage);
      }
    } catch (e) {
      console.log("Error creating product type:", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleAddToCart();
  };

  if (loading) return <p>Loading product...</p>;

  return(
    <div>
      <h2> Customizing a {product.name} </h2>
      
      <form className="card" onSubmit={handleSubmit} >
        {
        productOptions.map((productOption) => (
          <div key={productOption.id} style={{width: '100%'}}>
            <label htmlFor={`product_option_${productOption.id}_select`}>
              <strong>{productOption.name}</strong>
            </label>
            <select
              id={`product_option_${productOption.id}_select`}
              value={selectedOptions[productOption.id] || ""}
              onChange={(e) => handleOptionChange(productOption.id, parseInt(e.target.value))}
              disabled={productOptionValues[productOption.id]?.length == disabledOptions[productOption.id]?.length}
            >
              <option value="">Select an option</option>
              {
              productOptionValues[productOption.id]?.map((value) => (
                <option
                  key={"option_value_"+value.id}
                  value={value.id}
                  disabled={disabledOptions[productOption.id]?.includes(value.id)}
                >
                  {value.name}
                </option>
              ))
              }
            </select>
            {constraintMessages[productOption.id] && (
              <p className='constraint-message'>{constraintMessages[productOption.id]}</p>
            )}
          </div>
        ))
        }
        <div className="form-submit">
          <button type="submit">
            Add to Cart
          </button>
        </div>
      </form>

      <Link to={`/product_types/${product_type_id}/products`}>
        ← Back to Product Types
      </Link>
    </div>
  )
}

export default PublicProductDetails;