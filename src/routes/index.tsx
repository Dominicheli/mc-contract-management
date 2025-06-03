import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AssetsForm from "../pages/assets/Form";
import AssetsList from "../pages/assets/List";
import DefaultLayout from "../layouts/DefaultLayout";
import SalesContractForm from "../pages/salesContract/Form";
import SalesContractList from "../pages/salesContract/List";
import SupplierForm from "../pages/suppliers/Form";
import SupplierList from "../pages/suppliers/List";
import TypeAssetsForm from "../pages/typeAssets/Form";
import TypeAssetsList from "../pages/typeAssets/List";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Navigate to="/fornecedores" />} />
          <Route path="/fornecedores" element={<SupplierList />} />
          <Route path="/fornecedores/novo" element={<SupplierForm />} />
          <Route path="/fornecedores/editar/:id" element={<SupplierForm />} />
          <Route path="/tipo-de-ativo" element={<TypeAssetsList />} />
          <Route path="/tipo-de-ativo/novo" element={<TypeAssetsForm />} />
          <Route
            path="/tipo-de-ativo/editar/:id"
            element={<TypeAssetsForm />}
          />
          <Route path="/ativo" element={<AssetsList />} />
          <Route path="/ativo/novo" element={<AssetsForm />} />
          <Route path="/ativo/editar/:id" element={<AssetsForm />} />
          <Route path="/contrato-de-venda" element={<SalesContractList />} />
          <Route
            path="/contrato-de-venda/novo"
            element={<SalesContractForm />}
          />
          <Route
            path="/contrato-de-venda/editar/:id"
            element={<SalesContractForm />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
