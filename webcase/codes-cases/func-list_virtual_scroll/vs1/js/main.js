const MAX_LENGTH = 1000
function dataCreator() {
    const list = []
    for (let i = 0; i < MAX_LENGTH; i++) {
        list.push({id: i, content: `The Content ${i}`})
    }
    return list
}


window.onload = function() {
    const outerContainer = document.querySelector('[data-tagitem="virtual-scroller"]')
    const virtualScroller = new VirtualScroller(outerContainer, {
        viewRenderCount: 15
    })    
    virtualScroller.setData(dataCreator())
    virtualScroller.on(VirtualScroller.EVENT_NAME_CONFIG.SCROLL_TO_TOP, () => {
        console.log('scroll to top!')
    })
    virtualScroller.on(VirtualScroller.EVENT_NAME_CONFIG.SCROLL_TO_BOTTOM, () => {
        console.log('scroll to bottom!')
    })
    console.log(virtualScroller)    
}