import { useState } from 'react';
import AppRoutes from './Navigation/AppRoutes';
import './App.css';

function App() {
  // At the top of your App.jsx or main component
  console.log('App initializing...');
  console.log(
    'Initial token in localStorage:',
    localStorage.getItem('token') ? 'EXISTS' : 'NOT FOUND'
  );
  if (localStorage.getItem('token')) {
    console.log(
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
