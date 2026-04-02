import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SnakeGame } from './SnakeGame.tsx';
import './theme.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SnakeGame />
    </StrictMode>,
  );
}
