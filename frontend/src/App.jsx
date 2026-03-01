import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import AdminPage from './components/AdminPage'
import BillPage from './components/BillPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cashier" element={<BillPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}