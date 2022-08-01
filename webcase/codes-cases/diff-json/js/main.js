console.log(xGesture)

xGesture.run('#tapBox1', {
	longTap(evte, gesture) {
		console.log(this, evte, gesture)
	},
	pointerdown(evte, gesture) {
		console.log(this, evte, gesture)
	}
})

