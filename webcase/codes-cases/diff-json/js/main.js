console.log(xGesture)

xGesture.run('#guestBox1', {
	onPointerdown(evte, { clientX, clientY }, gesture) {
		console.log('onPointerdown', clientX, clientY)
	},
})

xGesture.run('#guestBox2', {
	onPointermove(evte, { clientX, clientY }, gesture) {
		evte.preventDefault()
		console.log('onPointermove', clientX, clientY)
	},
})

xGesture.run('#guestBox3', {
	onPointerup(evte, { clientX, clientY }, gesture) {
		console.log('onPointerup', clientX, clientY)
	},
})

xGesture.run('#guestBox13', {
	onPpointercancel(evte, { clientX, clientY }, gesture) {
		console.log('onPpointercancel', clientX, clientY)
	},
})

xGesture.run('#guestBox4', {
	onTap(evte, { tapX, tapY }, gesture) {
		console.log('onTap', tapX, tapY)
	},
})

xGesture.run('#guestBox5', {
	onLongTap(evte, { tapX, tapY }, gesture) {
		console.log('onLongTap', tapX, tapY)
	},
})

xGesture.run('#guestBox6', {
	onSingleTap(evte, { tapX, tapY }, gesture) {
		console.log('onSingleTap', tapX, tapY)
	},
})

xGesture.run('#guestBox7', {
	onDoubleTap(evte, { tapX, tapY }, gesture) {
		console.log('onDoubleTap', tapX, tapY)
	},
})

xGesture.run('#guestBox8', {
	onDragMove(evte, { direction, distX, distY, diffX, diffY, moveX, moveY }, gesture) {
		console.log('onDragMove', direction, distX, distY, diffX, diffY, moveX, moveY)
	},
})

xGesture.run('#guestBox9', {
	onSwipe(evte, { direction, distX, distY }, gesture) {
		console.log('onSwipe', direction, distX, distY)
	},
})

xGesture.run('#guestBox10', {
	onRotate(evte, { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
		console.log('onRotate', rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB)
	},
})

xGesture.run('#guestBox11', {
	onPinch(evte, { scale, centerX, centerY, pointA, pointB }, gesture) {
		console.log('onPinch', scale, centerX, centerY, pointA, pointB)
	},
})

let wheelScale = 1.0
let maxWheelScale = 10
let minWheelScale = 0.005
xGesture.run('#guestBox12', {
	onWheel(evte, { scale }, gesture) {
		evte.preventDefault()
		console.log('onWheel', scale)
		wheelScale *= scale
		if (wheelScale > maxWheelScale) {
		    wheelScale = maxWheelScale
		} else if (wheelScale < minWheelScale) {
		    wheelScale = minWheelScale
		}
		evte.target.innerHTML = `onWheel ${wheelScale}`
	},
})

