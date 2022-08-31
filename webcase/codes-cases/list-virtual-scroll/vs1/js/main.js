const MAX_LENGTH = 10000
function dataCreator() {
    const list = []
    for (let i = 0; i < MAX_LENGTH; i++) {
        list.push({id: i, content: `The Content ${i}`})
    }
    return list
}


window.addEventListener('DOMContentLoaded',function() {
    const virtualScroller = new VirtualScroller(document.querySelector('[data-tagitem="virtual-scroller"]'), {
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
        console.log('scrolling!', virtualScroller.getRenderedData())
    })

    console.log(virtualScroller.getRenderedData())
    console.log(virtualScroller)
})
