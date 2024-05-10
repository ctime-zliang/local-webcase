function main() {
	const appContainer1Element = document.getElementById('appContainer1')
	drawCanvas1(appContainer1Element)

	const appContainer2Element = document.getElementById('appContainer2')
	drawCanvas2(appContainer2Element)

	const appContainer3Element = document.getElementById('appContainer3')
	drawCanvas3(appContainer3Element)

	const appContainer4Element = document.getElementById('appContainer4')
	drawCanvas4(appContainer4Element)

	const appContainer5Element = document.getElementById('appContainer5')
	drawCanvas5(appContainer5Element)

	const appContainer6Element = document.getElementById('appContainer6')
	drawCanvas6(appContainer6Element)
}

window.onload = function () {
	main()
}
