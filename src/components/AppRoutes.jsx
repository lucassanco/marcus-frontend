import React from "react";
import { Route, Routes} from "react-router-dom";
import Landing from "../pages/Landing"

import PublicProductTypesTable from "../features/product_types/PublicProductTypesTable"
import PublicProductsTable from "../features/products/PublicProductsTable"
import PublicProductDetails from "../features/products/PublicProductDetails"

import ProductTypes from "../features/product_types/ProductTypes"
import ProductTypeDetails from "../features/product_types/ProductTypeDetails"
import ProductTypeEdit from "../features/product_types/ProductTypeEdit"

import ProductEdit from "../features/products/ProductEdit"

import ProductOptionEdit from "../features/product_options/ProductOptionEdit";

import ProductConstraintEdit from "../features/product_constraints/ProductConstraintEdit";

import PublicLayout from "./layouts/PublicLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      <Route path="/product_types" element={<PublicLayout />}>
        <Route index element={<PublicProductTypesTable />} />
        <Route path=":product_type_id/products" element={<PublicProductsTable />} />
        <Route path=":product_type_id/products/:product_id" element={<PublicProductDetails />} />
      </Route>

      <Route path="/private/product_types" element={<ProductTypes />} />
      <Route path="/private/product_types/:product_type_id" element={<ProductTypeDetails />} />
      <Route path="/private/product_types/:product_type_id/edit" element={<ProductTypeEdit />} />
      <Route path="/private/product_types/:product_type_id/products/:product_id/edit" element={<ProductEdit />} />
      <Route path="/private/product_types/:product_type_id/products/:product_id/options/:option_id/edit" element={<ProductOptionEdit />} />
      <Route path="/private/product_types/:product_type_id/products/:product_id/constraints/:constraint_id/edit" element={<ProductConstraintEdit />} />
    </Routes>
  );
}

export default AppRoutes;
