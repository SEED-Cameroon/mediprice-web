import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ServiceDetail from './pages/ServiceDetail'
import MedicationDetail from './pages/MedicationDetail'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'
import Services from './pages/Services'
import About from './pages/About'
import NotFound from './pages/NotFound'
import Search from './pages/Search'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />

          <Route
            path="/medication/:id"
            element={<MedicationDetail />}
          />

          <Route
            path="/service/:id"
            element={<ServiceDetail />}
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
