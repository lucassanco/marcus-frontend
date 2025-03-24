import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../constants";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

function ProductOptionsTable({initialOptions, onProductOptionDeleted}) {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { product_type_id, product_id } = useParams();

  useEffect(() => {
    fetchProductOptions();
  }, [initialOptions]);

  async function fetchProductOptions() {
    try {
      const url = `${API_URL}/product_types/${product_type_id}/products/${product_id}/options.json`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        setOptions(json);
        setLoading(false);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error...", e);
    }
  }

  const openModal = (productOption) => {
    setSelectedOption(productOption);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOption(null);
  };

  const handleDelete = async () => {
    if (!selectedOption) return;

    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/options/${selectedOption.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOptions((prev) => prev.filter(opt => opt.id !== selectedOption.id));
        onProductOptionDeleted(selectedOption.id)
        closeModal();
        toast.success(`${selectedOption.name} deleted`);
      } else {
        const errorText = await response.text();
        throw errorText;
      }
    } catch (error) {
      console.error("Error deleting product option:", error);
    }
  };

  if(loading) return (<h2> Loading options... </h2>)

  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Possible values</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {
          options.map((option) => (
            <tr key={option.id}>
              <th scope="row">
                <strong>{option.name}</strong>
              </th>
              <td>{option.values.map(item => item.name).join(', ')}</td>
              <td>
                <Link to={`/private/product_types/${product_type_id}/products/${product_id}/options/${option.id}/edit`}>
                  <FaEdit size={24}/>
                </Link>
                <FaTrashAlt 
                  size={24}
                  onClick={() => openModal(option)}
                  style={{ cursor: "pointer", color: "red" }} 
                />
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>

      <DeleteConfirmationModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default ProductOptionsTable;
