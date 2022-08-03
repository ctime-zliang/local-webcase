console.log(xGesture)

xGesture.run('#guestBox1', {	
	onPointerdown(evte, gesture) {
		console.log('onPointerdown', this, evte, gesture)
	},
})

xGesture.run('#guestBox2', {	
	onPointermove(evte, gesture) {
		console.log('onPointermove', this, evte, gesture)
	},
})

xGesture.run('#guestBox3', {	
	onPointerup(evte, gesture) {
		console.log('onPointerup', this, evte, gesture)
	},
})

xGesture.run('#guestBox13', {	
	onPpointercancel(evte, gesture) {
		console.log('onPpointercancel', this, evte, gesture)
	},
})

xGesture.run('#guestBox4', {	
	onTap(evte, gesture) {
		console.log('onTap', this, evte, gesture)
	},
})

xGesture.run('#guestBox5', {	
	onLongTap(evte, gesture) {
		console.log('onLongTap', this, evte, gesture)
	},
})

xGesture.run('#guestBox6', {	
	onSingleTap(evte, gesture) {
		console.log('onSingleTap', this, evte, gesture)
	},
})

xGesture.run('#guestBox7', {	
	onDoubleTap(evte, gesture) {
		console.log('onDoubleTap', this, evte, gesture)
	},
})

xGesture.run('#guestBox8', {	
	onDragMove(evte, gesture) {
		console.log('onDragMove', this, evte, gesture)
	},
})

xGesture.run('#guestBox9', {	
	onSwipe(evte, gesture) {
		console.log('onSwipe', this, evte, gesture)
	},
})

xGesture.run('#guestBox10', {	
	onRotate(evte, gesture) {
		console.log('onRotate', this, evte, gesture)
	},
})

xGesture.run('#guestBox11', {	
	onPinch(evte, gesture) {
		console.log('onPinch', this, evte, gesture)
	},
})

xGesture.run('#guestBox12', {	
	onWheel(evte, gesture) {
		evte.preventDefault()
		console.log('onWheel', this, evte, gesture)
	},
})

