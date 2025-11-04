export default class Queue {
  constructor(name) {
    this.name = name;
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
    return this.items.length;
  }

  dequeue() {
    return this.items.shift() ?? null;
  }

  cancel(item) {
    const i = this.items.indexOf(item);
    if (i === -1) return false;
    this.items.splice(i, 1);
    return true;
  }

  peek() {
    if (this.items.length > 0) {
      return this.items[0];
    } else return "empty";
  }

  getSize() {
    return this.items.length;
  }

  getQueue() {
    return [...this.items].toReversed();
  }
}
