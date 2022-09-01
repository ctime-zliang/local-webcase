const MAX_LENGTH = 80
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
                return `<div data-tagitem="${itemData.id}" style="background-color: #efefef; width: 100%;">${itemData.content}</div>`
            }
            return `<div data-tagitem="${itemData.id}" style="background-color: #ffffff; width: 100%;">${itemData.content}</div>`
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
    const outerContainerElement = document.querySelector('[data-tagitem="virtual-scroller"]')
    const virtualScroller = initVirtualScroller(outerContainerElement)

    const resizeObserver = new ResizeObserver((entries) => {
        virtualScroller.updateClientRect()
    })
    resizeObserver.observe(outerContainerElement)

    const initOuterContainerElementClientRect = outerContainerElement.getBoundingClientRect()
    document.getElementById('widthAddingRange').addEventListener('input', function(evte) {
        outerContainerElement.style.height = initOuterContainerElementClientRect.height + +this.value + 'px'
        console.log(virtualScroller.getRenderedData())
    })

    document.getElementById('updateItemById').addEventListener('click', function(evte) {
        virtualScroller.updateData((allListData, viewStartIndex, viewRenderCount) => {
            const findRes = ven$findList(allListData, 'id', 50)
            if (findRes.index <= -1) {
                return allListData
            }
            const findItem = findRes.data
            findItem.content = Math.random()
            return allListData
        })
    })

    document.getElementById('deleleItemById').addEventListener('click', function(evte) {
        virtualScroller.updateData((allListData, viewStartIndex, viewRenderCount) => {
            const findRes = ven$findList(allListData, 'id', 50)
            if (findRes.index <= -1) {
                return allListData
            }
            allListData.splice(findRes.index, 1)
            return allListData
        })
    })

    document.getElementById('addItemsInEnd').addEventListener('click', function(evte) {
        virtualScroller.updateData((allListData, viewStartIndex, viewRenderCount) => {
            for (let i = 0; i < 10; i++) {
                const t = allListData.length
                allListData.push({id: t, content: `The Content ${t}`})
            }
            return allListData
        })
    })

    document.getElementById('updateItemsByView').addEventListener('click', function(evte) {
        virtualScroller.updateData((allListData, viewStartIndex, viewRenderCount) => {
            const startIndex = viewStartIndex
            const endIndex = viewStartIndex + 10
            for (let i = startIndex; i < endIndex; i++) {
                if (allListData[i]) {
                    allListData[i].content = Math.random()
                }
            }
            return allListData
        })
    })

    document.getElementById('deleleItemsByView').addEventListener('click', function(evte) {
        virtualScroller.updateData((allListData, viewStartIndex, viewRenderCount) => {
            const startIndex = viewStartIndex + 2
            const endIndex = viewStartIndex + 2 + 10
            const filterListData = allListData
                .filter((itemData, index) => {
                    return index < startIndex || index > endIndex
                })
            return filterListData
        })
    })

    window.virtualScroller = virtualScroller
})
