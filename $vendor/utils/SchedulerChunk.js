class Ven$SchedulerChunk {
	static broswerSchedulerChunk(taskSize, taskHandler) {
		const scheduler = task => {
			window.requestIdleCallback(
				idle => {
					task(() => {
						// return idle.timeRemaining() || idle.didTimeout
						return idle.timeRemaining()
					})
				},
				{ timeout: 500 }
			)
		}
		return new Ven$SchedulerChunk(taskSize, taskHandler, scheduler)
	}

	constructor(taskSize, taskHandler, scheduler) {
		this._taskSize = taskSize
		this._taskHandler = taskHandler
		this._scheduler = scheduler
		this._chunkStartCallback = null
		this._chunkEndCallback = null
		this._finishCallback = null
		/* ... */
		this._chunkCount = 0
	}

	start() {
		if (this._taskSize <= 0) {
			return
		}
		let i = 0
		const run = () => {
			this._chunkStartCallback && this._chunkStartCallback(this._chunkCount)
			++this._chunkCount
			if (i >= this._taskSize) {
				this._chunkEndCallback && this._chunkEndCallback(this._taskSize - 1)
				this._finishCallback && this._finishCallback()
				return
			}
			this._scheduler(goOn => {
				while (goOn() && i < this._taskSize) {
					this._taskHandler(i)
					i++
				}
				this._chunkEndCallback && this._chunkEndCallback(this._chunkCount - 1)
				run()
			})
		}
		run()
	}

	setChunkStartHandler(callback) {
		this._chunkStartCallback = callback
	}

	setChunkEndHandler(callback) {
		this._chunkEndCallback = callback
	}

	setChunkFinishHandler(callback) {
		this._finishCallback = callback
	}
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

class Ven$SchedulerSlice {
	constructor(taskSize, taskHandler) {
		this._chunkTimeSize = 10
		/* ... */
		this._taskSize = taskSize
		this._taskHandler = taskHandler
		this._chunkStartCallback = null
		this._chunkEndCallback = null
		this._finishCallback = null
	}

	createChunkHandler() {
		const gen = function* (taskSize, taskHandler) {
			let count = 0
			while (count < taskSize) {
				yield taskHandler(count)
				count++
			}
		}
		const { _chunkTimeSize, _taskSize, _taskHandler, _chunkStartCallback, _chunkEndCallback, _finishCallback } = this
		const refConfig = { chunkCount: 0 }
		const generator = gen(_taskSize, _taskHandler)
		if (!generator || typeof generator.next !== 'function') {
			return
		}
		return function next() {
			_chunkStartCallback && _chunkStartCallback(refConfig.chunkCount)
			refConfig.chunkCount++
			const start = performance.now()
			let generatorResult = null
			do {
				generatorResult = generator.next()
				refConfig.count = generatorResult.value
			} while (generatorResult.done !== true && performance.now() - start < _chunkTimeSize)
			if (generatorResult.done) {
				_chunkEndCallback && _chunkEndCallback(refConfig.chunkCount - 1)
				_finishCallback && _finishCallback()
				return
			}
			_chunkEndCallback && _chunkEndCallback(refConfig.chunkCount - 1)
			window.requestIdleCallback(next, { timeout: 500 })
		}
	}

	setChunkStartHandler(callback) {
		this._chunkStartCallback = callback
	}

	setChunkEndHandler(callback) {
		this._chunkEndCallback = callback
	}

	setChunkFinishHandler(callback) {
		this._finishCallback = callback
	}
}
