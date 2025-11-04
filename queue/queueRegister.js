import Queue from "./queue.js";

const register = new Map();

export function getOrCreateQueue(name = "runs") {
  if (!register.has(name)) register.set(name, new Queue(name));
  return register.get(name);
}
