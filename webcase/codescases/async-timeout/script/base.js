function getRandomInArea(min = 0, max = Number.MAX_SAFE_INTEGER) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

async function asyncFetch() {
	const delay = getRandomInArea(4500, 6000)
	console.log(`Async Fetch Start...`)
	return new Promise((resolve, reject) => {
		window.setTimeout(() => {
			console.log(`Async Fetch End (${delay})...`)
			resolve('done.')
		}, delay)
	})
}

const asyncTimeoutHandler = new Ven$AsyncTimeout()

asyncTimeoutHandler
	.setListener((attempt, error, maxRetries, timeout, delay) => {
		console.log(`第 ${attempt + 1}/${maxRetries} 次执行任务等待耗时已大于设置的超时时间 ${timeout}, 将在 ${delay}ms 后再次尝试执行`)
		console.warn(error)
	})
	.exec(asyncFetch)
	.then(res => {
		console.log(res)
	})
	.catch(err => {
		console.error(err)
	})
