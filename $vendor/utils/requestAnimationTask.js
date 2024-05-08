;(function () {
	'use strict'

	const TIME_SEG_SIZE = (1 / 60) * 1000

	function runTask(task, resolve) {
		const start = performance.now()
		window.requestAnimationFrame(() => {
			if (performance.now() - start < TIME_SEG_SIZE) {
				task()
				resolve()
				return
			}
			runTask(task, resolve)
		})
	}

	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/
	/****************************************************************************************************/

	function requestAnimationTask(task) {
		return new Promise(resolve => {
			runTask(task, resolve)
		})
	}

	requestAnimationTask.version = '1.0.1'

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = requestAnimationTask
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return requestAnimationTask
		})
	} else {
		;(function () {
			return this || (0, eval)('this')
		})().requestAnimationTask = requestAnimationTask
	}
})()
