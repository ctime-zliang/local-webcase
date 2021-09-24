const RuntimeConfig = {
    lastIndex: 0,
    scrollTop: 0,
    rowsViewCount: 25,
    rowItemHeight: 35,
    rowsAllCount: 0,
    rowsData: []
}

function dataCreator() {
    const list = []
    const size = 100000
    for (let i = 0; i < size; i++) {
        list.push({id: i + 1, content: `The Content ${i+1}`})
    }
    return list
}

function insertHtml(data) {
    if (!(data instanceof Array)) {
        return
    }
    const sliceData = data.slice(RuntimeConfig.lastIndex, RuntimeConfig.lastIndex + RuntimeConfig.rowsViewCount)
    const htmlString = 
        sliceData
        .map((item, index) => {
            return `<div data-itemid="${item.id}" class="scroller-item">${item.content}</div>`
        })
        .join('\n')
    const scrollerUlist = document.querySelector(`.scroller-ulist`)
    scrollerUlist.innerHTML = htmlString
}

function beforeHandle() {
    const scrollerUlist = document.querySelector(`.scroller-ulist`)
    const scrollerContainer = document.querySelector(`.scroller-container`)
    const scrollerContainerRect = scrollerContainer.getBoundingClientRect()
    scrollerUlist.style.maxHeight = 
    scrollerUlist.style.height = `${scrollerContainerRect.height}px`
}

function afterHandle(data) {
    if (!(data instanceof Array)) {
        return
    }
    const scrollerBody = document.querySelector(`.scroller-body`)
    scrollerBody.style.height = `${RuntimeConfig.rowsAllCount * RuntimeConfig.rowItemHeight}px`
    scrollerBody.style.paddingTop = `${RuntimeConfig.scrollTop}px`
}

function eventHandle() {
    const scrollerWrapper = document.querySelector(`.scroller-wrapper`)
    const scrollerBody = document.querySelector(`.scroller-body`)
    scrollerWrapper.addEventListener('scroll', function(evte) {
        const eventScrollTop = evte.currentTarget.scrollTop
        if (eventScrollTop > RuntimeConfig.scrollTop && RuntimeConfig.lastIndex + RuntimeConfig.rowsViewCount > RuntimeConfig.rowsAllCount) {
            return
        }
        RuntimeConfig.scrollTop = eventScrollTop
        RuntimeConfig.lastIndex = ~~((RuntimeConfig.scrollTop / RuntimeConfig.rowItemHeight) | 0)
        scrollerBody.style.paddingTop = `${RuntimeConfig.scrollTop}px`
        insertHtml(RuntimeConfig.rowsData)
    })
}

window.onload = function() {
    const list = dataCreator()
    RuntimeConfig.rowsAllCount = list.length
    RuntimeConfig.rowsData = list
    beforeHandle()
    eventHandle()
    insertHtml(RuntimeConfig.rowsData)
    afterHandle(RuntimeConfig.rowsData)
}