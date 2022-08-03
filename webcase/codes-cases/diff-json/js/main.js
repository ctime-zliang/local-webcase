console.log(xGesture)

xGesture.run('#guestBox1', {
	onPointerdown(evte, gesture) {
		console.log('onPointerdown', evte, gesture)
	},
})

xGesture.run('#guestBox2', {
	onPointermove(evte, gesture) {
		evte.preventDefault()
		console.log('onPointermove', evte, gesture)
	},
})

xGesture.run('#guestBox3', {
	onPointerup(evte, gesture) {
		console.log('onPointerup', evte, gesture)
	},
})

xGesture.run('#guestBox13', {
	onPpointercancel(evte, gesture) {
		console.log('onPpointercancel', evte, gesture)
	},
})

xGesture.run('#guestBox4', {
	onTap(evte, gesture) {
		console.log('onTap', evte, gesture)
	},
})

xGesture.run('#guestBox5', {
	onLongTap(evte, gesture) {
		console.log('onLongTap', evte, gesture)
	},
})

xGesture.run('#guestBox6', {
	onSingleTap(evte, gesture) {
		console.log('onSingleTap', evte, gesture)
	},
})

xGesture.run('#guestBox7', {
	onDoubleTap(evte, gesture) {
		console.log('onDoubleTap', evte, gesture)
	},
})

xGesture.run('#guestBox8', {
	onDragMove(evte, gesture) {
		console.log('onDragMove', evte, gesture)
	},
})

xGesture.run('#guestBox9', {
	onSwipe(evte, gesture) {
		console.log('onSwipe', evte, gesture)
	},
})

xGesture.run('#guestBox10', {
	onRotate(evte, gesture) {
		console.log('onRotate', evte, gesture)
	},
})

xGesture.run('#guestBox11', {
	onPinch(evte, gesture) {
		console.log('onPinch', evte, gesture)
	},
})

let wheelScale = 1.0
xGesture.run('#guestBox12', {
	onWheel(evte, { scale }, gesture) {
		evte.preventDefault()
		console.log('onWheel', evte, scale, gesture)
		wheelScale *= scale
		this.innerHTML = `onWheel ${wheelScale}`
	},
})

