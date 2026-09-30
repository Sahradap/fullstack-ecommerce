import './App.css'
import OrderSummary from './pages/OrderSummary'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import NotFound from './pages/NotFound'
import { Route,Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home/>} />

      <Route path="/products" element={<Products/>} />
      
      <Route path="/products/:id" element={<ProductDetail/>} />

      <Route path="/cart" element={<Cart/>} />

      <Route path="/login" element={<Login/>} />

      <Route path="/register" element={<Register/>} />

      <Route path="/order-summary" element={<ProtectedRoute> <OrderSummary /> </ProtectedRoute>}/>

      <Route path="/orders" element={<ProtectedRoute> <Orders/> </ProtectedRoute>} />

      <Route path="*" element={<NotFound/>} />

      <Route path="/checkout" element={<ProtectedRoute> <Checkout /> </ProtectedRoute> }/>
    </Routes>
    <Footer/>
    </>
  );
}

export default App
