import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import './App.css'
import Login from './pages/Login'

function App() {
  return (
    // Note: No <Router> or <BrowserRouter> tags here!
    <Routes>
      <Route path="/" element={<Register />} />
         <Route path="/login" element={<Login />}/>
      <Route path="/dashboard" element={<Dashboard />}/>
    </Routes>
  )
}

export default App