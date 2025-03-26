import { useState } from 'react';
import UserNavBar from './Components/UserNavBar';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UserNavBar />
    </>
  );
}

export default App;
