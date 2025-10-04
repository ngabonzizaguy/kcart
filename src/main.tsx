import React from 'react';
import ReactDOM from 'react-dom/client';

import { MainApp } from './features/customer/components/MainApp';
import '../styles/globals.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
);
