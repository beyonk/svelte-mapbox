export class EventQueue {
  queue = []
  started = false
  map = null

  send (command, params = []) {
    if (!command) { return }
    this.queue.push([ command, params ])
    this.#process()
  }

  start (map) {
    this.started = true
    this.map = map
  }

  #process () {
    if (!this.started) { return }
    while (this.queue.length) {
      const [ command, params ] = this.queue.shift()
      this.map[command].apply(this.map, params)
    }
  }

  stop () {
    if (!this.started) { return }
    this.queue = []
    this.map = null
    this.started = false
  }
}
