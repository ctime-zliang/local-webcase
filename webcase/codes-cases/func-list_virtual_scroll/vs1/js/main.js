const MAX_LENGTH = 1000
function dataCreator() {
    const list = []
    for (let i = 0; i < MAX_LENGTH; i++) {
        list.push({id: i + 1, content: `The Content ${i+1}`})
    }
    return list
}


window.onload = function() {
    const outerContainer = document.querySelector('[data-tagitem="virtual-scroller"]')
    const virtualScroller = new VirtualScroller(outerContainer, {
        rowsViewCount: 10
    })    
    virtualScroller.setData(dataCreator())
    console.log(virtualScroller)    
}