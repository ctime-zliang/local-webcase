const RUNTIME_PROFILE1 = {
	taskSize: 25000,
	datas: [],
	taskContainerElement: document.getElementById('raskTest1'),
	/* ... */
	initData() {
		for (let i = 0; i < RUNTIME_PROFILE1.taskSize; i++) {
			const rdm = Math.random()
			RUNTIME_PROFILE1.datas.push(rdm)
		}
	},
	appendChild(idx) {
		const divElement = document.createElement('div')
		const appendTargetContainerElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-target-container`)
		divElement.innerText = idx
		appendTargetContainerElement.appendChild(divElement)
	},
}

function task1() {
	RUNTIME_PROFILE1.initData()
	/* ... */
	const profile = {}
	const chunkHandler = Ven$SchedulerChunk.broswerSchedulerChunk(RUNTIME_PROFILE1.taskSize, RUNTIME_PROFILE1.appendChild)
	chunkHandler.setChunkStartHandler(idx => {
		profile.eStartTime = performance.now()
		console.log(`Chunk Item Idx: ${idx} Start.`)
	})
	chunkHandler.setChunkEndHandler(idx => {
		profile.eEndTime = performance.now()
		console.log(`Chunk Item Idx: ${idx} End, time: ${profile.eEndTime - profile.eStartTime}.`)
		const spanElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-target-container-childcount`)
		const childContainerElement = RUNTIME_PROFILE1.taskContainerElement.querySelector('.append-target-container')
		spanElement.innerText = childContainerElement.childElementCount
	})
	chunkHandler.setChunkFinishHandler(() => {
		profile.aEndTime = performance.now()
		console.log(`Chunk Item Finished, time: ${profile.aEndTime - profile.aStartTime}.`)
	})
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE1.taskContainerElement.querySelector(`.append-dom-task-btn`)
	appendDOMTaskBtnElement.addEventListener('click', function (e) {
		profile.aStartTime = performance.now()
		chunkHandler.start()
	})
}