import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../constants.js";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal.jsx";
import { useParams } from "react-router-dom";

function ProductsTable({initialProducts}) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { product_type_id } = useParams();

  useEffect(() => {
    fetchProducts();
  }, [initialProducts]);

  async function fetchProducts() {
    try {
      const url = `${API_URL}/product_types/${product_type_id}/products.json`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        setProducts(json);
        setLoading(false);
      } else throw response;
    } catch (e) {
      console.log("Error fetching products...", e);
    }
  }

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`${API_URL}/product_types/${product_type_id}/products/${selectedProduct.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prevProducts) => prevProducts.filter(p => p.id !== selectedProduct.id));
        closeModal();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
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
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="3" >Your products will appear here</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <th scope="row">
                  <strong>{product.name}</strong>
                </th>
                <td>{product.description}</td>
                <td>
                  <Link to={`/private/product_types/${product_type_id || productTypeId}/products/${product.id}/edit`}>
                    <FaEdit size={24} />
                  </Link>
                  <FaTrashAlt size={24}
                    onClick={() => openModal(product)}
                    style={{ cursor: "pointer", color: "red"}} 
                  />
                </td>
              </tr>
            ))
          )}
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

export default ProductsTable;
