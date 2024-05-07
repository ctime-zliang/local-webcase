const RUNTIME_PROFILE2 = {
	taskSize: 25000,
	datas: [],
	sortDatas: [],
	taskContainerElement: document.getElementById('raskTest2'),
	/* ... */
	initData() {
		for (let i = 0; i < RUNTIME_PROFILE2.taskSize; i++) {
			const rdm = Math.random()
			RUNTIME_PROFILE2.datas.push(rdm)
		}
		const min = 0
		const max = 100000
		const MAX_LENGTH = 5000
		for (let i = MAX_LENGTH - 1; i >= 0; i--) {
			RUNTIME_PROFILE2.sortDatas.push(ven$getRandomInArea(min, max))
		}
	},
	appendChild(idx) {
		const divElement = document.createElement('div')
		const appendTargetContainerElement = RUNTIME_PROFILE2.taskContainerElement.querySelector(`.append-target-container`)
		divElement.innerText = idx
		appendTargetContainerElement.appendChild(divElement)
		// const array = window.ArraySort.ven$bubbleSortOptimi([...RUNTIME_PROFILE2.sortDatas])
	},
}

function task2() {
	RUNTIME_PROFILE2.initData()
	/* ... */
	const profile = {}
	const sliceHandler = new Ven$SchedulerSlice(RUNTIME_PROFILE2.taskSize, RUNTIME_PROFILE2.appendChild)
	sliceHandler.setChunkStartHandler(idx => {
		profile.eStartTime = performance.now()
		console.log(`Chunk Item Idx: ${idx} Start.`)
	})
	sliceHandler.setChunkEndHandler(idx => {
		profile.eEndTime = performance.now()
		console.log(`Chunk Item Idx: ${idx} End, time: ${profile.eEndTime - profile.eStartTime}.`)
		const spanElement = RUNTIME_PROFILE2.taskContainerElement.querySelector(`.append-target-container-childcount`)
		const childContainerElement = RUNTIME_PROFILE2.taskContainerElement.querySelector('.append-target-container')
		spanElement.innerText = childContainerElement.childElementCount
	})
	sliceHandler.setChunkFinishHandler(() => {
		profile.aEndTime = performance.now()
		console.log(`Chunk Item Finished, time: ${profile.aEndTime - profile.aStartTime}.`)
	})
	const chunkHandler = sliceHandler.createChunkHandler()
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE2.taskContainerElement.querySelector(`.append-dom-task-btn`)
	appendDOMTaskBtnElement.addEventListener('click', function (e) {
		profile.aStartTime = performance.now()
		chunkHandler()
	})
}
