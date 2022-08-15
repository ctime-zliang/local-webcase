console.log(xGesture)

AlertManager.init()

var globalContainerElement = document.getElementById('appContainer')
var interactiveSelectedClassname = 'gesture-interactive-selected'

;(function(containerElement) {
    const fullcaseBtnElement = containerElement.querySelector('[data-tagitem="fullcase-btn"]')
    xGesture.attach(fullcaseBtnElement, {
        onTap(evte, { tapX, tapY }, gesture) {
            console.log(evte, { tapX, tapY }, gesture)
        }
    })
})(globalContainerElement);

