import { useCart } from "../../context/CartContext";
import { FaTrashAlt } from "react-icons/fa";
import { API_URL } from "../../constants";

function Cart() {
  const { cartItems, removeItem } = useCart();

  const handleDeleteCartItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/cart_items/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) 
        removeItem(id);
      else
        throw response;
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }
  };

  return (
    <>
      <h1>Cart</h1>
      <div className="cart-wrapper">
        <div className="cart-items-container">
          {
            cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) :
          cartItems.map((item) => (
            <div key={item.id} className="card white-border">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p><strong>{item.product_name}</strong></p>
                <FaTrashAlt
                  size={18}
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleDeleteCartItem(item.id)}
                />
              </div>

              {
                item.selected_options_names.length === 0 ? (
                  <p><em>With default values from manufacturer</em></p>
                ) : (
                  item.selected_options_names.map((selected_option, index) => (
                    <p key={`selected_option_${index}`}>
                      {selected_option[0]}: {selected_option[1]}
                    </p>
                  ))
                )
              }
            </div>
            ))
          }
        </div>
      </div>
    </>
  );
}

export default Cart;
