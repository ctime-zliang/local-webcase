const RUNTIME_PROFILE4 = {
	taskSize: 100,
	datas: [],
	sortDatas: [],
	taskContainerElement: document.getElementById('raskTest4'),
	/* ... */
	initData() {
		for (let i = 0; i < RUNTIME_PROFILE4.taskSize; i++) {
			const rdm = Math.random()
			RUNTIME_PROFILE4.datas.push(rdm)
		}
		const min = 0
		const max = 100000
		const MAX_LENGTH = 50000
		for (let i = MAX_LENGTH - 1; i >= 0; i--) {
			RUNTIME_PROFILE4.sortDatas.push(ven$getRandomInArea(min, max))
		}
	},
	taskHandler(sourceArray) {
		const array = window.ArraySort.ven$bubbleSortOptimi(sourceArray)
		return array
	},
}

function task4() {
	RUNTIME_PROFILE4.initData()
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE4.taskContainerElement.querySelector(`.append-dom-task-btn`)
	appendDOMTaskBtnElement.addEventListener('click', async function (e) {
		// console.time(`Task`)
		// const array = RUNTIME_PROFILE4.taskHandler(RUNTIME_PROFILE4.sortDatas)
		// console.log(array)
		// console.timeEnd(`Task`)
		// return

		console.time(`Task`)
		const chunkArray1 = ven$chunkArray(RUNTIME_PROFILE4.sortDatas, 1000)
		const sortedArray1 = []
		for (let i = 0; i < chunkArray1.length; i++) {
			console.time(`Loop ${i}`)
			const array = RUNTIME_PROFILE4.taskHandler([...chunkArray1[i]])
			sortedArray1.push(array)
			console.timeEnd(`Loop ${i}`)
		}
		console.log(sortedArray1)
		console.timeEnd(`Task`)
		return

		const scheduler = window.requestAnimationFrame.bind(window)
		console.time(`Task`)
		const chunkArray2 = ven$chunkArray(RUNTIME_PROFILE4.sortDatas, 1000)
		const sortedArray2 = []
		for (let i = 0; i < chunkArray2.length; i++) {
			console.time(`Chunk ${i}`)
			await schedulerTask(() => {
				const array = RUNTIME_PROFILE4.taskHandler(chunkArray2[i])
				sortedArray2.push(array)
			}, scheduler)
			console.timeEnd(`Chunk ${i}`)
		}
		console.log(sortedArray2)
		console.timeEnd(`Task`)
	})
}
