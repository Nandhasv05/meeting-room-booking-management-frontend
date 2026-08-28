import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { hideBootSplash } from './components/ui/Activity';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '0.875rem',
              border: '1px solid rgba(18, 35, 21, 0.12)',
              boxShadow: '0 16px 40px -24px rgba(15, 32, 21, 0.35)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#2F7A4E', secondary: '#fff' } },
            error: { iconTheme: { primary: '#122315', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

window.setTimeout(hideBootSplash, 400);
