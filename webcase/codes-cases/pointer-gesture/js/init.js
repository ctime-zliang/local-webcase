console.log(xGesture)

AlertManager.init()

var globalContainerElement = document.getElementById('appContainer')
var interactiveSelectedClassname = 'gesture-interactive-selected'

;(function(containerElement) {
    const fullcaseContainerElement = containerElement.querySelector('[data-tagitem="fullcaseContainer"]')
    const fullcaseBtnElement = containerElement.querySelector('[data-tagitem="fullcase-btn"]')
    const exitFullcaseBtnElement = containerElement.querySelector('[data-tagitem="exit-fullcase-btn"]')

    xGesture.attach(fullcaseBtnElement)
    .onTap((evte, { tapX, tapY }, gesture) => {
        console.log(evte, gesture)
        fullcaseContainerElement.style.display = 'block'
    })

    xGesture.attach(exitFullcaseBtnElement)
    .onTap((evte, { tapX, tapY }, gesture) => {
        console.log(evte, gesture)
        AlertManager
        .setBtns([AlertManager.defaultConfirmBtn, AlertManager.defaultCancelBtn])
        .open('确定要退出综合案例么?', function(tag) {
            if (tag === 'confirm') {
                fullcaseContainerElement.style.display = 'none'
            }
            this.close()
        })
    })
    .onLongTap((evte, { tapX, tapY }, gesture) => {
        console.log(evte, gesture)
        AlertManager
        .setBtns([AlertManager.defaultConfirmBtn])
        .open('长按无效哦~', function(tag) {
            this.close()
        })
    })

    const pageHeaderElement = containerElement.querySelector('.page-header')
    const pageContentElement = containerElement.querySelector('.page-content')
    const pageFooterElement = containerElement.querySelector('.page-footer')
    xGesture.attach(pageHeaderElement)
    .onDoubleTap((evte, { tapX, tapY }, gesture) => {
        pageContentElement.scrollTop = 0
    })
    xGesture.attach(pageFooterElement)
    .onDoubleTap((evte, { tapX, tapY }, gesture) => {
        pageContentElement.scrollTop = pageContentElement.scrollHeight
    })

    // fullcaseContainerElement.style.display = 'block'
})(globalContainerElement);

