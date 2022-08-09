console.log(xGesture)

const globalContainerElement = document.getElementById('appContainer')

/**
 * Pointer Down
 */
;(function(sectionElement) {
    const pointerdownGuestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const pointerdownCountElement = sectionElement.querySelector('[data-tagitem="pointerdown-count"]')

    let pointerdownCount = 0
    let styleUpdateTimer = null

    xGesture.attach(pointerdownGuestureElement, {
        onPointerdown(evte, { clientX, clientY }, guesture) {
            window.clearTimeout(styleUpdateTimer)
            pointerdownGuestureElement.classList.add('guesture-interactive-pointerdown')
            pointerdownCountElement.textContent = ++pointerdownCount
            styleUpdateTimer = window.setTimeout(() => {
                pointerdownGuestureElement.classList.remove('guesture-interactive-pointerdown')
            }, 85)
        },
    })
})(globalContainerElement.querySelector('[data-tagitem="pointerdown"]'));