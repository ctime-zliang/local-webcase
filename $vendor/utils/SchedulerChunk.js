class Ven$SchedulerChunk {
	static broswerSchedulerChunk(taskSize, taskHandler) {
		const scheduler = task => {
			window.requestIdleCallback(idle => {
				task(() => {
					return idle.timeRemaining()
				})
			})
		}
		return new Ven$SchedulerChunk(taskSize, taskHandler, scheduler)
	}

	constructor(taskSize, taskHandler, scheduler) {
		this._taskSize = taskSize
		this._taskHandler = taskHandler
		this._scheduler = scheduler
		this._chunkStart = null
		this._chunkEnd = null
		this._finish = null
	}

	start() {
		if (this._taskSize <= 0) {
			return
		}
		let i = 0
		let chunkCount = 0
		const run = () => {
			this._chunkStart && this._chunkStart(chunkCount)
			++chunkCount
			if (i >= this._taskSize) {
				this._finish && this._finish()
				return
			}
			this._scheduler(goOn => {
				while (goOn() && i < this._taskSize) {
					this._taskHandler(i)
					i++
				}
				this._chunkEnd && this._chunkEnd(chunkCount - 1)
				run()
			})
		}
		run()
	}

	setChunkStartHandler(callback) {
		this._chunkStart = callback
	}

	setChunkEndHandler(callback) {
		this._chunkEnd = callback
	}

	setChunkFinishHandler(callback) {
		this._finish = callback
	}
}
