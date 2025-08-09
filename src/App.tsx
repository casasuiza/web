import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Admin from './pages/Admin/Admin.tsx';
import Login from './pages/Auth/Login.tsx';
import NotFound from './pages/NotFound.tsx';
import AdminRoute from './pages/Auth/components/AdminRoute.tsx';

function App() {

  return (
    <Router basename="/Casa-Suiza-Web">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="/payment/success" element={<Home />} />
        <Route path="/payment/failure" element={<Home />} />
        <Route path="/payment/pending" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
