import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './pages/App.tsx';
import ThemePreview from './pages/ThemePreview.tsx';
import ImagesGenerator from './pages/ImagesGenerator.tsx';
import './theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
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
