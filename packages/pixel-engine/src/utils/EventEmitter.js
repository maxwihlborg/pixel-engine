export default class EventEmitter {
  constructor() {
    this.eventListeners = new Map();
  }

  emit(evt, ...args) {
    if (this.eventListeners.has(evt)) {
      this.eventListeners.get(evt).forEach(cb => cb(...args));
    }
    return this;
  }

  off(evt, cb) {
    if (!this.eventListeners.has(evt)) {
      return;
    }
    if (this.eventListeners.get(evt).has(cb)) {
      this.eventListeners.get(evt).delete(cb);
      if (this.eventListeners.get(evt).size() === 0) {
        this.eventListeners.delete(evt);
      }
    }
    return this;
  }

  on(evt, cb) {
    if (!this.eventListeners.has(evt)) {
      this.eventListeners.set(evt, new Set([cb]));
      return this;
    }
    if (!this.eventListeners.get(evt).has(cb)) {
      this.eventListeners.get(evt).add(cb);
    }
    return this;
  }
}
