import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './pages/App.tsx';
import ThemePreview from './pages/ThemePreview.tsx';
import ImagesGenerator from './pages/ImagesGenerator.tsx';
import './theme.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/theme" element={<ThemePreview />} />
          <Route path="/images-generator" element={<ImagesGenerator />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
} else {
  console.error('Root element not found');
}
