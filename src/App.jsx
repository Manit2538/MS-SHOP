// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductPage from './ProductPage';
import ProductDetailPage from './ProductDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}