const MAX_LENGTH = 10000
function dataCreator() {
    const list = []
    for (let i = 0; i < MAX_LENGTH; i++) {
        list.push({id: i, content: `The Content ${i}`})
    }
    return list
}

function initVirtualScroller(outerContainerElement) {
    const virtualScroller = new VirtualScroller(outerContainerElement, {
        rowItemHeight: 25,
        createItemRender(itemData, index) {
            if (index % 2 === 0) {
                return `<div style="background-color: #efefef; width: 100%;">${itemData.content}</div>`
            }
            return `<div style="background-color: #ffffff; width: 100%;">${itemData.content}</div>`
        },
    })

    virtualScroller.setData(dataCreator())
    virtualScroller.on(VirtualScroller.EVENT_CONSTANCE.SCROLL_TO_TOP, () => {
        console.log('scroll to top!', virtualScroller)
    })
    virtualScroller.on(VirtualScroller.EVENT_CONSTANCE.SCROLL_TO_BOTTOM, () => {
        console.log('scroll to bottom!', virtualScroller)
    })
    virtualScroller.on(VirtualScroller.EVENT_CONSTANCE.SCROLLING, () => {
        console.log('scrolling!')
    })

    console.log(virtualScroller.getRenderedData())
    console.log(virtualScroller)

    return virtualScroller
}


window.addEventListener('DOMContentLoaded',function() {
    const widthAddingRangeElement = document.getElementById('widthAddingRange')
    const outerContainerElement = document.querySelector('[data-tagitem="virtual-scroller"]')
    const virtualScroller = initVirtualScroller(outerContainerElement)

    const resizeObserver = new ResizeObserver((entries) => {
        virtualScroller.updateClientRect()
    })
    resizeObserver.observe(outerContainerElement)

    const initOuterContainerElementClientRect = outerContainerElement.getBoundingClientRect()
    widthAddingRangeElement.addEventListener('input', function(evte) {
        outerContainerElement.style.height = initOuterContainerElementClientRect.height + +this.value + 'px'
        console.log(virtualScroller.getRenderedData())
    })
})
