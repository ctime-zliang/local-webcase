console.log(xGesture)

AlertManager.init()

var globalContainerElement = document.getElementById('appContainer')
var interactiveSelectedClassname = 'gesture-interactive-selected'

;(function(containerElement) {
    const fullcaseContainerElement = containerElement.querySelector('[data-tagitem="fullcaseContainer"]')
    const fullcaseBtnElement = containerElement.querySelector('[data-tagitem="fullcase-btn"]')
    
    xGesture.attach(fullcaseBtnElement, {
        onTap(evte, { tapX, tapY }, gesture) {
            fullcaseContainerElement.style.display = 'block'
        }
    })
})(globalContainerElement);

