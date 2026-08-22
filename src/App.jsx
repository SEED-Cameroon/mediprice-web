import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalogue from './pages/Catalogue'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
