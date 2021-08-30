class Ven$OpsHistory {
    constructor(maxSnapshots = 20) {
        this.maxSnapshots = maxSnapshots
        this.snapshots = []
        this.index = -1
    }

    allowRedo() {
        return this.snapshots.length > this.index + 1
    }

    allowUndo() {
        return this.index > 0
    }

    getAllSnapshots() {
        return JSON.parse(JSON.stringify(this.snapshots))
    }

    undo() {
        if (this.allowUndo()) {
            this.index -= 1
            return this.snapshots[this.index]
        }
        return null
    }
    
    redo() {
        if (this.allowRedo()) {
            this.index += 1
            return this.snapshots[this.index]
        }
        return null
    }

    clear() {
        this.index = -1
        this.snapshots = []
    }

    record(snapshot) {
        while (this.index < this.snapshots.length - 1) {
            this.snapshots.pop()
        }
        this.snapshots.push(snapshot)
        if (this.snapshots.length > this.maxSnapshots) {
          this.snapshots.shift()
        }
        this.index = this.snapshots.length - 1
        return snapshot
    }
}