const TASK_SIZE = 20000
const datas = []

function initData() {
	for (let i = 0; i < TASK_SIZE; i++) {
		const rdm = Math.random()
		datas.push(rdm)
	}
}

function appendChild(idx) {
	const divElement = document.createElement('div')
	const appendTargetContainerElement = document.getElementById('appendTargetContainer')
	divElement.innerText = idx
	appendTargetContainerElement.appendChild(divElement)
}

function syncTask() {
	for (let i = 0; i < datas.length; i++) {
		appendChild(i)
	}
}

function task1() {
	initData()
	/* ... */
	const profile = {}
	const chunkHandler = Ven$SchedulerChunk.broswerSchedulerChunk(TASK_SIZE, appendChild)
	chunkHandler.setChunkStartHandler(idx => {
		profile.eStartTime = performance.now()
		console.log(`Chunk Item Idx: ${idx} Start.`)
	})
	chunkHandler.setChunkEndHandler(idx => {
		profile.eEndTime = performance.now()
		appendTargetContainerChildCountElement.innerText = appendTargetContainerElement.childElementCount
		console.log(`Chunk Item Idx: ${idx} End, time: ${profile.eEndTime - profile.eStartTime}.`)
	})
	chunkHandler.setChunkFinishHandler(() => {
		profile.aEndTime = performance.now()
		console.log(`Chunk Item Finished, time: ${profile.aEndTime - profile.aStartTime}.`)
	})
	/* ... */
	const appendTargetContainerChildCountElement = document.getElementById(`appendTargetContainerChildCount`)
	const appendTargetContainerElement = document.getElementById('appendTargetContainer')
	const appendDOMTaskBtnElement = document.getElementById(`appendDOMTaskBtn`)
	appendDOMTaskBtnElement.addEventListener('click', function (e) {
		profile.aStartTime = performance.now()
		chunkHandler.start()
		// syncTask()
	})
}
