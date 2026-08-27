import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { hideBootSplash } from './components/ui/Activity';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);

window.setTimeout(hideBootSplash, 400);
