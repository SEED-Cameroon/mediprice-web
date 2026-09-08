import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ServiceDetail from './pages/ServiceDetail'
import MedicationDetail from './pages/MedicationDetail'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import Services from './pages/Services'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/medication/:id"
            element={<MedicationDetail />}
          />

          <Route
            path="/service/:id"
            element={<ServiceDetail />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
