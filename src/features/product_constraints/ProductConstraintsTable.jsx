import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../constants";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

function ProductConstraintsTable({initialConstraints}) {
  const [loading, setLoading] = useState(true);
  const [constraints, setConstraints] = useState(null);

  const [selectedConstraint, setSelectedConstraint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { product_type_id, product_id } = useParams();

  useEffect(() => {
    fetchProductConstraints();
  }, [initialConstraints]);

  async function fetchProductConstraints() {
    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/constraints.json`);
      if (response.ok) {
        const json = await response.json();
        setConstraints(json);
        setLoading(false);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error...", e);
    }
  }

  const openModal = (constraint) => {
    setSelectedConstraint(constraint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConstraint(null);
  };

  const handleDelete = async () => {
    if (!selectedConstraint) return;

    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${product_id}/constraints/${selectedConstraint.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setConstraints((prev) => prev.filter(opt => opt.id !== selectedConstraint.id));
        closeModal();
        toast.success("Product constraint deleted successfully");
      } else {
        const errorText = await response.text();
        throw errorText;
      }
    } catch (error) {
      console.error("Error deleting product option:", error);
    }
  };

  if(loading) return (<h2> Loading constraints... </h2>)

  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">Constrainer</th>
            <th scope="col">Constrainee</th>
            <th scope="col">When Constrainer is</th>
            <th scope="col">Then available values for Constrainee are</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {
          constraints.map((constraint) => (
            <tr key={constraint.id}>
              <td> {constraint.option_1_name} </td>
              <td> {constraint.option_2_name} </td>
              <td> {constraint.value_1_name} </td>
              <td>{constraint.allowed_values_names}</td>
              <td>
                <Link to={`/private/product_types/${product_type_id}/products/${product_id}/constraints/${constraint.id}/edit`}>
                  <FaEdit size={24}/>
                </Link>
                <FaTrashAlt 
                  size={24}
                  onClick={() => openModal(constraint)}
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

export default ProductConstraintsTable;