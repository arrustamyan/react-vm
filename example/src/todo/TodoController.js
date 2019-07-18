export class TodoController {

  items = [];

  count = 0;

  $mount() {
    console.log('Todo: Initialized!');
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
