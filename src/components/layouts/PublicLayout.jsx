// components/layouts/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Cart from "../../features/carts/Cart"; // your cart component

function PublicLayout() {
  return (
    <div className="public-layout">
      <main className="main-content">
        <Outlet />
      </main>
      <aside className="cart-sidebar">
        <Cart />
      </aside>
    </div>
  );
}

export default PublicLayout;
