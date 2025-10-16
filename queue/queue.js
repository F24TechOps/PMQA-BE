export default class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue(item) {
    return this.items.shift();
  }

  cancel(item) {
    if (this.items.includes(item)) {
      return this.items.splice(this.items.indexOf(item), 1);
    } else return "No Such Run Enqueued";
  }

  peek() {
    if (this.items.length > 0) {
      return this.items[0];
    } else return "empty";
  }

  getSize() {
    return this.items.length();
  }
}
