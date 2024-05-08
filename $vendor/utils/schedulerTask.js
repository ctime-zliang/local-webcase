;(function () {
	'use strict'

	const TIME_SEG_SIZE = 1000 / 60

	function runTask(task, resolve, scheduler) {
		const start = performance.now()
		scheduler(() => {
			if (performance.now() - start < TIME_SEG_SIZE) {
				task()
				resolve()
				return
			}
			runTask(task, resolve, scheduler)
		})
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	function schedulerTask(task, scheduler = window.setTimeout.bind(window)) {
		return new Promise(resolve => {
			runTask(task, resolve, scheduler)
		})
	}

	schedulerTask.version = '1.0.1'

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = schedulerTask
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return schedulerTask
		})
	} else {
		;(function () {
			return this || (0, eval)('this')
		})().schedulerTask = schedulerTask
	}
})()
