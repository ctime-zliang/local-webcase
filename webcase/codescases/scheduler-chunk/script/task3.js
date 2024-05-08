const RUNTIME_PROFILE3 = {
	taskSize: 15000,
	datas: [],
	sortDatas: [],
	taskContainerElement: document.getElementById('raskTest3'),
	/* ... */
	initData() {
		for (let i = 0; i < RUNTIME_PROFILE3.taskSize; i++) {
			const rdm = Math.random()
			RUNTIME_PROFILE3.datas.push(rdm)
		}
		const min = 0
		const max = 100000
		const MAX_LENGTH = 5000
		for (let i = MAX_LENGTH - 1; i >= 0; i--) {
			RUNTIME_PROFILE3.sortDatas.push(ven$getRandomInArea(min, max))
		}
	},
	appendChild(idx) {
		console.log(`Task running.`)
		const divElement = document.createElement('div')
		const appendTargetContainerElement = RUNTIME_PROFILE3.taskContainerElement.querySelector(`.append-target-container`)
		divElement.innerText = idx
		appendTargetContainerElement.appendChild(divElement)
		// const array = window.ArraySort.ven$bubbleSortOptimi([...RUNTIME_PROFILE3.sortDatas])
	},
}

function task3() {
	RUNTIME_PROFILE3.initData()
	/* ... */
	const profile = {}
	/* ... */
	const appendDOMTaskBtnElement = RUNTIME_PROFILE3.taskContainerElement.querySelector(`.append-dom-task-btn`)
	appendDOMTaskBtnElement.addEventListener('click', async function (e) {
		profile.aStartTime = performance.now()
		for (let i = 0; i < RUNTIME_PROFILE3.taskSize; i++) {
			// RUNTIME_PROFILE3.appendChild(i)
			await requestAnimationTask(() => {
				RUNTIME_PROFILE3.appendChild(i)
			})
		}
	})
}
