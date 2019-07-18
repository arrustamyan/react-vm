export class TodoController {

  items = [];

  count = 0;

  $mount({ prop }) {
    console.log('Todo: Initialized!', prop);
  }

  $unmount() {
    console.log('Todo: Destroyed!');
  }

  increment() {
    this.count++;
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
