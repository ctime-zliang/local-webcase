console.log(xGesture)

AlertManager.init()

var globalContainerElement = document.getElementById('appContainer')
var interactiveSelectedClassname = 'gesture-interactive-selected'

;(function(containerElement) {
    const fullcaseContainerElement = containerElement.querySelector('[data-tagitem="fullcaseContainer"]')
    const fullcaseBtnElement = containerElement.querySelector('[data-tagitem="fullcase-btn"]')
    const exitFullcaseBtnElement = containerElement.querySelector('[data-tagitem="exit-fullcase-btn"]')

    xGesture.attach(fullcaseBtnElement, {
        onTap(evte, { tapX, tapY }, gesture) {
            fullcaseContainerElement.style.display = 'block'
        }
    })
    xGesture.attach(exitFullcaseBtnElement, {
        onTap(evte, { tapX, tapY }, gesture) {
            AlertManager.open('确定要退出综合案例么?', {
                callback(tag) {
                    if (tag === 'confirm') {
                        fullcaseContainerElement.style.display = 'none'
                    }
                    this.close()
                }
            })
        }
    })

    // fullcaseContainerElement.style.display = 'block'
})(globalContainerElement);

