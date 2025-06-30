import React from 'react';
import ReactDOM from 'react-dom/client';
import { SimpleSynth } from './components/SimpleSynth';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SimpleSynth />
  </React.StrictMode>
);