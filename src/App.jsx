import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App