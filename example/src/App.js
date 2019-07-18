import React, { useState, useEffect } from 'react';

import Todo from './todo';

function App() {
  const [state, update] = useState(null);
  useEffect(() => {
    console.log('App: update');
    return () => {
      console.log('App: unmount');
    }
  });
  return (
    <div className="App">
      {state}
      <button onClick={() => update(Math.random())}>Update</button>
      {state > 0.5 &&
      <Todo prop='value' />
      }
    </div>
  );
}

export default App;
