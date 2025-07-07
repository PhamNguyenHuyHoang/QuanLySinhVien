import React from 'react'
import './index.css'
import App from './App.tsx'
import 'antd/dist/reset.css';
import ReactDOM from 'react-dom/client';
import './i18n'; // import cấu hình i18n

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
