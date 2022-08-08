DrawDragMoveLine.init(document.getElementById('dragMoveCanvas'))

console.log(xGesture)

xGesture.attach('#guestBox1', {
	onPointerdown(evte, { clientX, clientY }, gesture) {
		console.log('onPointerdown', { clientX, clientY })
	},
})

xGesture.attach('#guestBox2', {
	onPointermove(evte, { clientX, clientY }, gesture) {
		evte.preventDefault()
		console.log('onPointermove', { clientX, clientY })
	},
})

xGesture.attach('#guestBox3', {
	isPreventDefaultInLongDown: true,
	onPointerup(evte, { clientX, clientY }, gesture) {
		console.log('onPointerup', { clientX, clientY })
	},
})

xGesture.attach('#guestBox13', {
	onPpointercancel(evte, { clientX, clientY }, gesture) {
		console.log('onPpointercancel', { clientX, clientY })
	},
})

xGesture.attach('#guestBox4', {
	onTap(evte, { tapX, tapY }, gesture) {
		console.log('onTap', { tapX, tapY })
	},
})

xGesture.attach('#guestBox5', {
	isPreventDefaultInLongDown: true,
	onLongTap(evte, { tapX, tapY }, gesture) {
		console.log('onLongTap', { tapX, tapY })
	},
	onContextmenu(evte, { clientX, clientY }, gesture) {
		// evte.preventDefault()
		console.log('onContextmenu', evte, { clientX, clientY }, gesture)
	}
})

xGesture.attach('#guestBox6', {
	onSingleTap(evte, { tapX, tapY }, gesture) {
		console.log('onSingleTap', { tapX, tapY })
	},
})

xGesture.attach('#guestBox7', {
	onDoubleTap(evte, { tapX, tapY }, gesture) {
		console.log('onDoubleTap', { tapX, tapY })
	},
})

const gBox8 = document.getElementById('guestBox8')
const gBox8ClientRect = gBox8.getBoundingClientRect()
xGesture.attach('#guestBox8', {
	onPointerdown(evte, { clientX, clientY }, gesture) {
		DrawDragMoveLine.drawStart()
	},
	onDragMove(evte, { movePosition, moveDirection, distX, distY, speedX, speedY, clientX, clientY }, gesture) {
		console.log('onDragMove', JSON.stringify({ movePosition, moveDirection, distX, distY, speedX, speedY, clientX, clientY }))
		evte.target.innerHTML = `onDragMove (movePosition: ${movePosition}, moveDirection: ${moveDirection})`
		DrawDragMoveLine.addPath({ x: clientX - gBox8ClientRect.left, y: clientY - gBox8ClientRect.top })
		DrawDragMoveLine.drawMove()
	},
})

xGesture.attach('#guestBox9', {
	onSwipe(evte, { direction, distX, distY, releaseX, releaseY }, gesture) {
		console.log('onSwipe', { direction, distX, distY, releaseX, releaseY })
	},
})

xGesture.attach('#guestBox10', {
	onRotate(evte, { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
		console.log('onRotate', { rotate, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
	},
})

xGesture.attach('#guestBox11', {
	onPinch(evte, { scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB }, gesture) {
		console.log('onPinch', { scale, centerX, centerY, lastCenterX, lastCenterY, pointA, pointB })
	},
})

let wheelScale = 1.0
let maxWheelScale = 10
let minWheelScale = 0.005
xGesture.attach('#guestBox12', {
	onWheel(evte, { scale, clientX, clientY }, gesture) {
		console.log('onWheel', { scale, clientX, clientY })
		wheelScale *= scale
		if (wheelScale > maxWheelScale) {
		    wheelScale = maxWheelScale
		} else if (wheelScale < minWheelScale) {
		    wheelScale = minWheelScale
		}
		evte.target.innerHTML = `onWheel (${wheelScale})`
	},
})


