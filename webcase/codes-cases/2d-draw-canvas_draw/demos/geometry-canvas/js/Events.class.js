const EVENT_NS = {
    WINDOW_RESIZE: 'WINDOW_RESIZE'
}

class Events {
    constructor() {
        this.events = {}
    }

    on(name, callback) {
        if (typeof name !== 'string' || !name || typeof callback !== 'function') {
            return
        }
        if (!this.events[name]) {
            this.events[name] = []
        }
        this.events[name].push(callback)
    }

    emit(name) {
        if (!arguments.length || typeof name !== 'string' || !this.events[name]) {
            return
        }
        const params = arguments.splice(1)
        this.events[name].forEach((item, index) => {
            item(params)
        })
    }
}