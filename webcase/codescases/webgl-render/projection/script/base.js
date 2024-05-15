ven$importScript('../common/utils/cuon-matrix.js')

function initProfilePanelControl() {
	const profilePanels = document.querySelectorAll(`[data-tagitem="profile-panel"]`)
	for (let i = 0; i < profilePanels.length; i++) {
		profilePanels[i].addEventListener('mouseover', function (e) {
			this.style.opacity = '0.8'
		})
		profilePanels[i].addEventListener('mouseout', function (e) {
			this.style.opacity = '0.3'
		})
	}
}

function main() {
	initProfilePanelControl()

	const appContainer1Element = document.getElementById('appContainer1')
	drawCanvas1(appContainer1Element)

	const appContainer2Element = document.getElementById('appContainer2')
	drawCanvas2(appContainer2Element)

	const appContainer3Element = document.getElementById('appContainer3')
	drawCanvas3(appContainer3Element)

	const appContainer4Element = document.getElementById('appContainer4')
	drawCanvas4(appContainer4Element)
}

window.onload = function () {
	main()
}
