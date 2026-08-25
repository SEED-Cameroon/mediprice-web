import { BrowserRouter, Routes, Route } from "react-router-dom";

import Medications from "./pages/Medications";
import Home from "./pages/Home";
import MedicationDetail from "./pages/MedicationDetail";
import ServiceDetail from "./pages/ServiceDetail";
import Catalog from "./pages/Catalog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/medications"
          element={<Medications />}
        />

        <Route
          path="/medications/:id"
          element={<MedicationDetail />}
        />

        <Route
          path="/labs-services/:id"
          element={<ServiceDetail />}
        />

        <Route
          path="/catalog"
          element={<Catalog />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;