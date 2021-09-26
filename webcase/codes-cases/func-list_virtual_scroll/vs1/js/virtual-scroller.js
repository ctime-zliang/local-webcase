const positionContainer = (htmlString = '') => {
    return `<div style="z-index: -9999; position: absolute; left: -9999px; top: -9999px;">${htmlString}</div>`
}
const virtualScrollerFragmentTemplate = () => {
    return `
        <div class="virtual-scroller-container">
            <div class="virtual-scroller-wrapper">
                <div class="virtual-scroller-content">
                    <div class="virtual-scroller-ulist">
                        <div class="virtual-scroller-item"></div>
                    </div>
                </div>
            </div>
        </div>
    `
}
const virtualScrollerItemTemplate = (itemData = {}) => {
    return `<div data-itemid="${itemData.id}" class="virtual-scroller-item">${itemData.content}</div>`
}
const defaultRuntimeConfig = {
    lastIndex: 0,
    scrollTop: 0,
    rowItemHeight: 30,
    rowsViewCount: 20,
    rowsAllCount: 0,
    rowsData: []
}

class VirtualScroller {
    constructor(el, option = {}) {
        this.RuntimeConfig = { ...defaultRuntimeConfig, ...option }
        this.RuntimeConfig.outerContainer = el
        this._init()
        this._initFragment()
        this._bindEvent()
    }

    setData(list) {
        const RuntimeConfig = this.RuntimeConfig
        RuntimeConfig.rowsData = list
        RuntimeConfig.rowsAllCount = list.length
        this._setContentRect()
        this._insertHtml()
    }

    _init() {
        const RuntimeConfig = this.RuntimeConfig
        RuntimeConfig.outerContainerRect = RuntimeConfig.outerContainer.getBoundingClientRect()        
    }

    _initFragment() {
        const RuntimeConfig = this.RuntimeConfig
        document.body.appendChild(document.createRange().createContextualFragment(positionContainer(virtualScrollerFragmentTemplate())))
        const positionElement = document.body.lastElementChild
        const ulistElement = positionElement.querySelector(`.virtual-scroller-ulist`)
        const itemElement = ulistElement.firstElementChild
        /* ... */
        ulistElement.style.maxHeight = RuntimeConfig.outerContainerRect.height + 'px'
        RuntimeConfig.rowItemHeight = itemElement.getBoundingClientRect().height
        ulistElement.innerHTML = ''
        RuntimeConfig.outerContainer.innerHTML = ''
        RuntimeConfig.outerContainer.appendChild(positionElement.firstElementChild)        
        document.body.removeChild(positionElement)
        RuntimeConfig.container = RuntimeConfig.outerContainer.firstElementChild
    }

    _setContentRect() {
        const RuntimeConfig = this.RuntimeConfig
        const contentElement = RuntimeConfig.container.querySelector(`.virtual-scroller-content`)
        contentElement.style.height = `${RuntimeConfig.rowsAllCount * RuntimeConfig.rowItemHeight}px`
        contentElement.style.paddingTop = `${RuntimeConfig.scrollTop}px`
    }

    _bindEvent() {
        const self = this
        const RuntimeConfig = this.RuntimeConfig
        const wrapperElement = RuntimeConfig.container.querySelector(`.virtual-scroller-wrapper`)
        const contentElement = RuntimeConfig.container.querySelector(`.virtual-scroller-content`)
        wrapperElement.addEventListener('scroll', function(evte) {
            const eventScrollTop = evte.currentTarget.scrollTop
            if (eventScrollTop > RuntimeConfig.scrollTop && RuntimeConfig.lastIndex + RuntimeConfig.rowsViewCount > RuntimeConfig.rowsAllCount) {
                return
            }
            RuntimeConfig.scrollTop = eventScrollTop
            RuntimeConfig.lastIndex = ~~((RuntimeConfig.scrollTop / RuntimeConfig.rowItemHeight) | 0)
            contentElement.style.paddingTop = `${RuntimeConfig.scrollTop}px`
            self._insertHtml()
        })
    }

    _insertHtml() {
        const RuntimeConfig = this.RuntimeConfig
        const ulistElement = RuntimeConfig.container.querySelector(`.virtual-scroller-ulist`)
        const sliceData = RuntimeConfig.rowsData.slice(RuntimeConfig.lastIndex, RuntimeConfig.lastIndex + RuntimeConfig.rowsViewCount)
        const htmlString = 
            sliceData
            .map((item, index) => {
                return virtualScrollerItemTemplate(item)
            })
            .join('\n')
        ulistElement.innerHTML = htmlString
    }
}