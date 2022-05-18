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
const defaultConfig = {
    /* 滚动过程中渲染在可视区域的第一个元素数据在总列表中的索引 */
    viewStartIndex: 0,
    /* scroller-content 元素的内顶边距 */
    contentAreaYOffset: 0,
    /* scroller-content 元素的内顶边距可设置的最小值 */
    contentAreaYOffsetMin: 0,
    /* scroller-content 元素的内顶边距可设置的最大值 */
    contentAreaYOffsetMax: 0,
    /* 单行元素的高度 */
    rowItemHeight: 30,
    /* 列表总高度 */
    rowsAllHeight: 0,
    /* 列表总长度 */
    dataAllCount: 0,
    /* 列表数据集 */
    listData: [],
    /* 其他 */
    _timer: null
}
const defaultProfile = {
    /* 滚动过程中渲染出的真实 DOM 个数 */
    viewRenderCount: 20,
}

const EVENT_NAME_CONFIG = {
    SCROLL_TO_TOP: 'SCROLL_TO_TOP',
    SCROLL_TO_BOTTOM: 'SCROLL_TO_BOTTOM'
}

class VirtualScroller {
    constructor(el, option = {}) {
        this._runtimeConfig = { ...defaultProfile, ...option, ...defaultConfig }
        this._runtimeConfig.outerContainer = el
        this._eventHandlers = {}
        this._init()
        this._initFragment()
        this._bindEvent()
    }

    setData(list) {
        const runtimeConfig = this._runtimeConfig
        runtimeConfig.listData = list
        runtimeConfig.dataAllCount = list.length
        runtimeConfig.rowsAllHeight = runtimeConfig.dataAllCount * runtimeConfig.rowItemHeight
        runtimeConfig.contentAreaYOffsetMax = runtimeConfig.rowsAllHeight - runtimeConfig.outerContainerRect.height
        this._setContentRect()
        this._insertHtml(this._sliceListData())
    }

    on(eventName, callback) {
        if (!eventName || typeof eventName != 'string' || !(callback instanceof Function)) {
            return
        }
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = []
        }
        this._eventHandlers[eventName].push(callback)
    }

    _init() {
        const runtimeConfig = this._runtimeConfig
        runtimeConfig.outerContainerRect = runtimeConfig.outerContainer.getBoundingClientRect()        
    }

    _initFragment() {
        const runtimeConfig = this._runtimeConfig
        document.body.appendChild(document.createRange().createContextualFragment(positionContainer(virtualScrollerFragmentTemplate())))
        const positionElement = document.body.lastElementChild
        const ulistElement = positionElement.querySelector(`.virtual-scroller-ulist`)
        const itemElement = ulistElement.firstElementChild
        /* ... */
        ulistElement.style.maxHeight = runtimeConfig.outerContainerRect.height + 'px'
        runtimeConfig.rowItemHeight = itemElement.getBoundingClientRect().height
        ulistElement.innerHTML = ''
        runtimeConfig.outerContainer.innerHTML = ''
        runtimeConfig.outerContainer.appendChild(positionElement.firstElementChild)        
        document.body.removeChild(positionElement)
        runtimeConfig.container = runtimeConfig.outerContainer.firstElementChild
    }

    _setContentRect() {
        const runtimeConfig = this._runtimeConfig
        const contentElement = runtimeConfig.container.querySelector(`.virtual-scroller-content`)
        contentElement.style.height = `${runtimeConfig.dataAllCount * runtimeConfig.rowItemHeight}px`
        contentElement.style.paddingTop = `${runtimeConfig.contentAreaYOffset}px`
    }

    _bindEvent() {
        const self = this
        const runtimeConfig = this._runtimeConfig
        const wrapperElement = runtimeConfig.container.querySelector(`.virtual-scroller-wrapper`)
        const contentElement = runtimeConfig.container.querySelector(`.virtual-scroller-content`)   
        const ulistElement = runtimeConfig.container.querySelector(`.virtual-scroller-ulist`)
        wrapperElement.addEventListener('scroll', function(evte) {
            let scrollTop = evte.currentTarget.scrollTop
            /* 阈值判断 */
            if (scrollTop <= runtimeConfig.contentAreaYOffsetMin) {
                self._emit(EVENT_NAME_CONFIG.SCROLL_TO_TOP)
                scrollTop = runtimeConfig.contentAreaYOffsetMin
            }
            if (scrollTop >= runtimeConfig.contentAreaYOffsetMax) {
                self._emit(EVENT_NAME_CONFIG.SCROLL_TO_BOTTOM)               
                scrollTop = runtimeConfig.contentAreaYOffsetMax
            }
            /* 修改视图 */
            runtimeConfig.contentAreaYOffset = scrollTop
            ulistElement.style.transform = `translate3d(0, ${runtimeConfig.contentAreaYOffset}px, 5px)`
            runtimeConfig.viewStartIndex = Math.floor((runtimeConfig.contentAreaYOffset / runtimeConfig.rowItemHeight)) || 0
            /* 渲染列表 */       
            self._insertHtml(self._sliceListData())
        })
    }

    _sliceListData() {
        const runtimeConfig = this._runtimeConfig
        return runtimeConfig.listData.slice(runtimeConfig.viewStartIndex, runtimeConfig.viewStartIndex + runtimeConfig.viewRenderCount)
    }

    _insertHtml(data) {
        const runtimeConfig = this._runtimeConfig
        const ulistElement = runtimeConfig.container.querySelector(`.virtual-scroller-ulist`)
        const htmlString = 
            data
            .map(item => {
                return virtualScrollerItemTemplate(item)
            })
            .join('\n')
        ulistElement.innerHTML = htmlString
    }

    _emit(eventName, ...args) {
        const events = this._eventHandlers[eventName]
        for (let i = 0; i < events.length; i++) {
            events[i](...args)
        } 
    }
}
VirtualScroller.EVENT_NAME_CONFIG = EVENT_NAME_CONFIG