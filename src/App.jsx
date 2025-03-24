import { BrowserRouter as Router } from "react-router-dom";

import './App.css'

import AppRoutes from "./components/AppRoutes"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <AppRoutes />
        <ToastContainer />
      </Router>
    </CartProvider>
  );
}

export default App;