
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
if (!publishableKey) {
  // Render a visible setup error instead of a blank page.
  root.render(
    <React.StrictMode>
      <div
        style={{
          fontFamily: 'Inter, Prompt, sans-serif',
          padding: '48px 24px',
          maxWidth: 720,
          margin: '0 auto',
          color: '#111111',
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>Missing Clerk publishable key</h1>
        <p style={{ marginBottom: 12 }}>
          Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to a root <code>.env.local</code> file and restart the dev server.
        </p>
        <p style={{ marginBottom: 0 }}>
          Example: <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code>
        </p>
      </div>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={publishableKey}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
