import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '16px',
            fontWeight: '700',
            fontFamily: 'Inter, sans-serif',
          },
        }}
        richColors
      />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* App shell with layout */}
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
