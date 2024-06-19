function fileReader() {
	const fileInputElement = document.createElement('input')
	fileInputElement.type = 'file'
	fileInputElement.name = 'file'
	fileInputElement.id = 'fileSelector'
	document.getElementById('appContainer').appendChild(fileInputElement)
	/* ... */
	const fileSelectorElement = document.getElementById('fileSelector')
	fileSelectorElement.addEventListener('change', function (e) {
		translateFile2Blob(this.files[0], (blob, file) => {
			console.log(blob)
			console.log(file)
			translateBlob2String(blob, (str, blob) => {
				console.log(str)
				console.log(blob)
			})
		})
	})
}

function translateFile2Blob(file, callback) {
	const fileReader = new FileReader()
	fileReader.onload = function (e) {
		const blob = new Blob([e.target.result], { type: file.type })
		callback && callback(blob, file)
	}
	fileReader.readAsDataURL(file)
}

function translateBlob2String(blob, callback) {
	const fileReader = new FileReader()
	fileReader.onload = function (e) {
		callback && callback(fileReader.result, blob)
	}
	fileReader.readAsText(blob, 'utf-8')
}
