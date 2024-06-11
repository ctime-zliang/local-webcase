class Ven$AsyncTimeout {
	constructor(maxRetries = 3, timeout = 5000, delay = 500) {
		this._listener = null
		this._maxRetries = maxRetries
		this._timeout = timeout
		this._delay = delay
	}

	setListener(fn) {
		this._listener = fn
		return this
	}

	async exec(fn) {
		let attempt = 0
		while (attempt < this._maxRetries) {
			try {
				const result = await Promise.race([
					fn(),
					this._timeoutController().then(() => {
						throw new Error('[delay controller] async task timeout...')
					}),
				])
				return result
			} catch (error) {
				this._listener && this._listener(attempt, error, this._maxRetries, this._timeout, this._delay)
				attempt++
				if (attempt === this._maxRetries) {
					throw error
				}
				await this._delayController()
			}
		}
	}

	async _delayController() {
		return new Promise((resolve, reject) => {
			window.setTimeout(() => {
				resolve(null)
			}, this._delay)
		})
	}

	async _timeoutController() {
		return new Promise((resolve, reject) => {
			window.setTimeout(() => {
				resolve(null)
			}, this._timeout)
		})
	}
}
