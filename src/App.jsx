import { useState } from 'react';
import AppRoutes from './Navigation/AppRoutes';
import './App.css';
import { useLogger } from '../src/Hook/useLogger.js';

function App() {
  const logger = useLogger();
  // At the top of your App.jsx or main component
  logger.log('App initializing...');
  logger.log(
    'Initial token in localStorage:',
    localStorage.getItem('token') ? 'EXISTS' : 'NOT FOUND'
  );
  if (localStorage.getItem('token')) {
    logger.log(
      'Token first 20 chars:',
      localStorage.getItem('token').substring(0, 20)
    );
  }
  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
