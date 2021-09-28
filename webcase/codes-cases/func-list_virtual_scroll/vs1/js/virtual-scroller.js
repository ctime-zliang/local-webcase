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
        this.RuntimeConfig = { ...defaultProfile, ...option, ...defaultConfig }
        this.RuntimeConfig.outerContainer = el
        this.eventHandlers = {}
        this._init()
        this._initFragment()
        this._bindEvent()
    }

    setData(list) {
        const RuntimeConfig = this.RuntimeConfig
        RuntimeConfig.listData = list
        RuntimeConfig.dataAllCount = list.length
        RuntimeConfig.rowsAllHeight = RuntimeConfig.dataAllCount * RuntimeConfig.rowItemHeight
        RuntimeConfig.contentAreaYOffsetMax = RuntimeConfig.rowsAllHeight - RuntimeConfig.outerContainerRect.height
        this._setContentRect()
        this._insertHtml(this._sliceListData())
    }

    on(eventName, callback) {
        if (!eventName || typeof eventName != 'string' || typeof callback != 'function') {
            return
        }
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = []
        }
        this.eventHandlers[eventName].push(callback)
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
        contentElement.style.height = `${RuntimeConfig.dataAllCount * RuntimeConfig.rowItemHeight}px`
        contentElement.style.paddingTop = `${RuntimeConfig.contentAreaYOffset}px`
    }

    _bindEvent() {
        const self = this
        const RuntimeConfig = this.RuntimeConfig
        const wrapperElement = RuntimeConfig.container.querySelector(`.virtual-scroller-wrapper`)
        const contentElement = RuntimeConfig.container.querySelector(`.virtual-scroller-content`)   
        const ulistElement = RuntimeConfig.container.querySelector(`.virtual-scroller-ulist`)
        wrapperElement.addEventListener('scroll', function(evte) {
            let scrollTop = evte.currentTarget.scrollTop
            /* 阈值判断 */
            if (scrollTop <= RuntimeConfig.contentAreaYOffsetMin) {
                self._emit(EVENT_NAME_CONFIG.SCROLL_TO_TOP)
                scrollTop = RuntimeConfig.contentAreaYOffsetMin
            }
            if (scrollTop >= RuntimeConfig.contentAreaYOffsetMax) {
                self._emit(EVENT_NAME_CONFIG.SCROLL_TO_BOTTOM)               
                scrollTop = RuntimeConfig.contentAreaYOffsetMax
            }
            /* 修改视图 */
            RuntimeConfig.contentAreaYOffset = scrollTop
            ulistElement.style.transform = `translate3d(0, ${RuntimeConfig.contentAreaYOffset}px, 5px)`
            RuntimeConfig.viewStartIndex = Math.floor((RuntimeConfig.contentAreaYOffset / RuntimeConfig.rowItemHeight)) || 0
            /* 渲染列表 */       
            self._insertHtml(self._sliceListData())
        })
    }

    _sliceListData() {
        const RuntimeConfig = this.RuntimeConfig
        return RuntimeConfig.listData.slice(RuntimeConfig.viewStartIndex, RuntimeConfig.viewStartIndex + RuntimeConfig.viewRenderCount)
    }

    _insertHtml(data) {
        const RuntimeConfig = this.RuntimeConfig
        const ulistElement = RuntimeConfig.container.querySelector(`.virtual-scroller-ulist`)
        const htmlString = 
            data
            .map(item => {
                return virtualScrollerItemTemplate(item)
            })
            .join('\n')
        ulistElement.innerHTML = htmlString
    }

    _emit(eventName, ...args) {
        const events = this.eventHandlers[eventName]
        for (let i = 0; i < events.length; i++) {
            events[i](...args)
        } 
    }
}
VirtualScroller.EVENT_NAME_CONFIG = EVENT_NAME_CONFIG