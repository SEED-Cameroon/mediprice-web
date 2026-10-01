import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import { CompareProvider } from './context/CompareContext'
import About from './pages/About'
import Catalogue from './pages/Catalogue'
import Compare from './pages/Compare'
import Home from './pages/Home'
import MedicationDetail from './pages/MedicationDetail'
import NotFound from './pages/NotFound'
import ProviderDetail from './pages/ProviderDetail'
import Search from './pages/Search'
import ServiceDetail from './pages/ServiceDetail'
import Services from './pages/Services'

/** Keeps links to the old URLs working, including any query string. */
const Redirect = ({ to }) => {
  const params = useParams()
  const path = typeof to === 'function' ? to(params) : to
  return <Navigate to={`${path}${window.location.search}`} replace />
}

function App() {
  return (
    <BrowserRouter>
      <CompareProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/medications" element={<Catalogue />} />
            <Route path="/medications/:id" element={<MedicationDetail />} />
            <Route path="/labs-services" element={<Services />} />
            <Route path="/labs-services/:id" element={<ServiceDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/providers/:id" element={<ProviderDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />

            {/* Old URLs from before the SRS route names */}
            <Route path="/catalogue" element={<Redirect to="/medications" />} />
            <Route path="/services" element={<Redirect to="/labs-services" />} />
            <Route path="/medication/:id" element={<Redirect to={({ id }) => `/medications/${id}`} />} />
            <Route path="/service/:id" element={<Redirect to={({ id }) => `/labs-services/${id}`} />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CompareProvider>
    </BrowserRouter>
  )
}

export default App
