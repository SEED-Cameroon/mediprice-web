import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import RequireRole from './components/RequireRole'
import StaffLayout from './components/admin/StaffLayout'
import { AuthProvider } from './context/AuthContext'
import AdminAccounts from './pages/admin/AdminAccounts'
import AdminCatalog from './pages/admin/AdminCatalog'
import AdminPrices from './pages/admin/AdminPrices'
import AdminProviders from './pages/admin/AdminProviders'
import ImportPrices from './pages/admin/ImportPrices'
import { ProviderDetails, ProviderPrices } from './pages/ProviderPortal'
import SignIn from './pages/SignIn'
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

const adminTabs = [
  { to: '/admin', label: 'Prices', end: true },
  { to: '/admin/import', label: 'Import' },
  { to: '/admin/catalog', label: 'Medicines & tests' },
  { to: '/admin/providers', label: 'Providers' },
  { to: '/admin/accounts', label: 'Accounts' },
]

const providerTabs = [
  { to: '/provider', label: 'My prices', end: true },
  { to: '/provider/details', label: 'My details' },
]

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
            <Route path="/sign-in" element={<SignIn />} />

            {/* SEED team */}
            <Route
              path="/admin"
              element={
                <RequireRole roles={['admin']}>
                  <StaffLayout title="SEED team" tabs={adminTabs} />
                </RequireRole>
              }
            >
              <Route index element={<AdminPrices />} />
              <Route path="import" element={<ImportPrices />} />
              <Route path="catalog" element={<AdminCatalog />} />
              <Route path="providers" element={<AdminProviders />} />
              <Route path="accounts" element={<AdminAccounts />} />
            </Route>

            {/* Pharmacies, labs and hospitals */}
            <Route
              path="/provider"
              element={
                <RequireRole roles={['provider']}>
                  <StaffLayout title="Provider" tabs={providerTabs} />
                </RequireRole>
              }
            >
              <Route index element={<ProviderPrices />} />
              <Route path="details" element={<ProviderDetails />} />
            </Route>

            {/* Old URLs from before the SRS route names */}
            <Route path="/catalogue" element={<Redirect to="/medications" />} />
            <Route path="/services" element={<Redirect to="/labs-services" />} />
            <Route path="/medication/:id" element={<Redirect to={({ id }) => `/medications/${id}`} />} />
            <Route path="/service/:id" element={<Redirect to={({ id }) => `/labs-services/${id}`} />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CompareProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
