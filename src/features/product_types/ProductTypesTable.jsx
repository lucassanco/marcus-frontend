import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../constants.js";
import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal.jsx";
import { toast } from "react-toastify";

function ProductTypesTable({initialProductTypes}) {
  const [loading, setLoading] = useState(true);
  const [productTypes, setProductTypes] = useState(initialProductTypes);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProductTypes();
  }, [initialProductTypes]);

  async function fetchProductTypes() {
    try {
      const response = await fetch(`${API_URL}/product_types.json`);
      if (response.ok) {
        const json = await response.json();
        setProductTypes(json);
        setLoading(false);
      } else {
        throw response;
      }
    } catch (e) {
      console.log("Error...", e);
    }
  }

  const openModal = (productType) => {
    setSelectedProductType(productType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductType(null);
  };

  const handleDelete = async () => {
    if (!selectedProductType) return;

    try {
      const response = await fetch(`${API_URL}/product_types/${selectedProductType.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProductTypes((prevProductTypes) => prevProductTypes.filter(pt => pt.id !== selectedProductType.id));
        closeModal();
        toast.success("Product type deleted successfully");
      } else {
        const errorText = await response.text();
        throw errorText;
      }
    } catch (error) {
      console.error("Error deleting product type:", error);
    }
  };  

  if (loading) return <h2>Loading products...</h2>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {productTypes.map((product_type) => (
            <tr key={product_type.id}>
              <th scope="row">
                <strong>{product_type.name}</strong>
              </th>
              <td>{product_type.description}</td>
              <td>
                <div className="table-actions">
                  <Link to={`/private/product_types/${product_type.id}`}>
                    <FaEye size={24}/>
                  </Link>
                  |
                  <Link to={`/private/product_types/${product_type.id}/edit`}>
                    <FaEdit size={24} />
                  </Link>
                  |
                  <FaTrashAlt
                    size={24}
                    onClick={() => openModal(product_type)}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </div>
              </td>
            </tr>
          ))}
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

export default ProductTypesTable;
