console.log(xGesture)

xGesture.attch('#guestBox1', {
	onPointerdown(evte, { clientX, clientY }, gesture) {
		console.log('onPointerdown', { clientX, clientY })
	},
})

xGesture.attch('#guestBox2', {
	onPointermove(evte, { clientX, clientY }, gesture) {
		evte.preventDefault()
		console.log('onPointermove', { clientX, clientY })
	},
})

xGesture.attch('#guestBox3', {
	isPreventDefaultInLongDown: true,
	onPointerup(evte, { clientX, clientY }, gesture) {
		console.log('onPointerup', { clientX, clientY })
	},
})

xGesture.attch('#guestBox13', {
	onPpointercancel(evte, { clientX, clientY }, gesture) {
		console.log('onPpointercancel', { clientX, clientY })
	},
})

xGesture.attch('#guestBox4', {
	onTap(evte, { tapX, tapY }, gesture) {
		console.log('onTap', { tapX, tapY })
	},
})

xGesture.attch('#guestBox5', {
	isPreventDefaultInLongDown: true,
	onLongTap(evte, { tapX, tapY }, gesture) {
		console.log('onLongTap', { tapX, tapY })
	},
	onContextmenu(evte, gesture) {
		// evte.preventDefault()
		console.log('onContextmenu', evte, gesture)
	}
})

xGesture.attch('#guestBox6', {
	onSingleTap(evte, { tapX, tapY }, gesture) {
		console.log('onSingleTap', { tapX, tapY })
	},
})

xGesture.attch('#guestBox7', {
	onDoubleTap(evte, { tapX, tapY }, gesture) {
		console.log('onDoubleTap', { tapX, tapY })
	},
})

xGesture.attch('#guestBox8', {
	onDragMove(evte, { direction, distX, distY, moveX, moveY, clientX, clientY }, gesture) {
		console.log('onDragMove', { direction, distX, distY, moveX, moveY, clientX, clientY })
	},
})

xGesture.attch('#guestBox9', {
	onSwipe(evte, { direction, distX, distY }, gesture) {
		console.log('onSwipe', { direction, distX, distY })
	},
})

xGesture.attch('#guestBox10', {
	onRotate(evte, { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
		console.log('onRotate', { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
	},
})

xGesture.attch('#guestBox11', {
	onPinch(evte, { scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
		console.log('onPinch', { scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
	},
})

let wheelScale = 1.0
let maxWheelScale = 10
let minWheelScale = 0.005
xGesture.attch('#guestBox12', {
	onWheel(evte, { scale }, gesture) {
		console.log('onWheel', { scale })
		wheelScale *= scale
		if (wheelScale > maxWheelScale) {
		    wheelScale = maxWheelScale
		} else if (wheelScale < minWheelScale) {
		    wheelScale = minWheelScale
		}
		evte.target.innerHTML = `onWheel ${wheelScale}`
	},
})

