A tiny library that enables old school MVC, MVVM, MVWhatever approach with React.

# Usage

Given that you have a component that needs to be smart called `<Todo />`. You can write it's business logic in plain ES6 class like this:

```js
export class TodoController {

  items = [];

  // method receives props passed to <Todo />
  $mount({ prop }) {
    console.log('Todo: Initialized with ', prop);
  }

  $unmount() {
    console.log('Todo: Destroyed!');
  }

  toggleDone(index) {
    this.items[index].done = !this.items[index].done;
  }

  addItem(description) {
    this.items.push({
      description,
      done: false,
    })
  }

}
```

Than you can use this controller as initialized object in your component:

```jsx
import { useViewModel } from 'react-vm';

export function Todo() {
  const vm = useViewModel();

  // in case you don't want to pollute your business logic with a controlled input
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
```

You only have to pair the component and the controller to create a so called viewModel (this might be not how it's called at all, i am still confused):

```js
import { Todo } from './Todo';
import { TodoController } from './TodoController';
import { viewModel } from 'react-vm';

export default viewModel(Todo, TodoController);
```

All the changes on the controller instance are triggering rerendering on the react component.

You can ignore some property change triggering by adding @IgnoreProp annotation to property(Typescript)
```ts
import { IgnoreProp } from 'react-vm';

export class TodoController {

  @IgnoreProp
  items = [];
}

```

 or adding that property name to static ignoredProps array.(ES6 or Typescript) 
 
```js
export class TodoController {

  items = [];

  static ignoredProps = ['items']
}

```

Wondering how it works? Take a look at the code. It's simple and very ugly.

**DISCLAIMER:** This is just a prototype of an idea and is implemented in a very non-efficient way. It most probably does not cover a lot of use cases as it was not tested on large scale apps. If you think this is a terrible idea, I'd happily like to know why.

