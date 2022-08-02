console.log(xGesture)

xGesture.run('#tapBox1', {	
	pointerdown(evte, gesture) {
		console.log('pointerdown', this, evte, gesture)
	},
	pointermove(evte, gesture) {
		console.log('pointermove', this, evte, gesture)
	},
	pointerup(evte, gesture) {
		console.log('pointerup', this, evte, gesture)
	},
	tap(evte, gesture) {
		console.log('tap', this, evte, gesture)
	},
	longTap(evte, gesture) {
		console.log('longTap', this, evte, gesture)
	},
	singleTap(evte, gesture) {
		console.log('singleTap', this, evte, gesture)
	},
	doubleTap(evte, gesture) {
		console.log('doubleTap', this, evte, gesture)
	},
	dragMove(evte, gesture) {
		console.log('dragMove', this, evte, gesture)
	},
	swipe(evte, gesture) {
		console.log('swipe', this, evte, gesture)
	},
	rotate(evte, gesture) {
		console.log('rotate', this, evte, gesture)
	},
	pinch(evte, gesture) {
		console.log('pinch', this, evte, gesture)
	},
	wheel(evte, gesture) {
		console.log('wheel', this, evte, gesture)
	},
})

