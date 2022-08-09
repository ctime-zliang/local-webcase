console.log(xGesture)

const globalContainerElement = document.getElementById('appContainer')

;(function(sectionElement) {
    const pointerdownGuestureElement = sectionElement.querySelector('[data-tagitem="guesture"]')
    const pointerdownCountElement = sectionElement.querySelector('[data-tagitem="pointerdown-count"]')

    let pointerdownCount = 0

    xGesture.attach(pointerdownGuestureElement, {
        onPointerdown(evte, { clientX, clientY }, guesture) {
            evte.target.classList.add('guesture-interactive-pointerdown')
            pointerdownCountElement.textContent = ++pointerdownCount
        },
        onPointerup(evte, { clientX, clientY }, guesture) {
            evte.target.classList.remove('guesture-interactive-pointerdown')
        }
    })
})(globalContainerElement.querySelector('[data-tagitem="pointerdown"]'));