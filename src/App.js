import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import "./styles/global.css"; // Підключення загальних стилів зі спіннером

// Динамічний імпорт сторінок
const HomePage = lazy(() => import("./pages/HomePage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ContactsPage = lazy(() => import("./pages/ContactsPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Suspense
          fallback={
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner"></div>
              <p>Завантаження...</p>
            </div>
          }
        >
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* Можна додати сторінку 404 */}
              <Route path="*" element={<div className="not-found">Сторінку не знайдено</div>} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
