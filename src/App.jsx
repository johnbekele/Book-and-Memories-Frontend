import { useState } from 'react';
import AppRoutes from './Navigation/AppRoutes';
import './App.css';
import { useLogger } from '../src/Hook/useLogger.js';
import { ThemeProvider } from '../src/Context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorBoundary from './ErrorBoundary.jsx';
import CustomErrorFallback from './Components/CustomErrorFallback.jsx';

function App() {
  const logger = useLogger();

  // logger.log('App initializing...');
  // logger.log(
  //   'Initial token in localStorage:',
  //   localStorage.getItem('token') ? 'EXISTS' : 'NOT FOUND'
  // );
  // if (localStorage.getItem('token')) {
  //   logger.log(
  //     'Token first 20 chars:',
  //     localStorage.getItem('token').substring(0, 20)
  //   );
  // }

  // Create a client

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
        cacheTime: 1000 * 60 * 30, // Unused data is garbage collected after 30 minutes
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        retry: 1, // Retry failed requests once
      },
    },
  });

  return (
    <div>
      <ErrorBoundary fallback={CustomErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
