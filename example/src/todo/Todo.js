import React, { useState } from 'react';

import { useViewModel } from '../viewmodel';

export function Todo() {
  const vm = useViewModel();
  const [description, setDescription] = useState('');

  return (
    <ul>
      <li>
        {vm.count}
        <button onClick={() => vm.increment()}>Increment</button>
      </li>
      <li>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
        <button onClick={() => vm.addItem(description)}>Add</button>
      </li>
    {vm.items.map((item, index) =>
      <li key={index}>
        <label>
          <input type="checkbox" checked={item.done} onChange={() => vm.toggleDone(index)} /> {item.description}
        </label>
      </li>
    )}
    </ul>
  );
}
