const EVENT_CONSTANCE = {
    SCROLL_TO_TOP: 'SCROLL_TO_TOP',
    SCROLL_TO_BOTTOM: 'SCROLL_TO_BOTTOM',
    SCROLLING: 'SCROLLING'
}

const createPositionContainer = (htmlString = '') => {
    return `<div style="z-index: -9999; position: absolute; left: -9999px; top: -9999px;">${htmlString}</div>`
}
const createVirtualScrollerTemplate = () => {
    return `
        <div class="virtualscroller-container">
            <div class="virtualscroller-wrapper">
                <div class="virtualscroller-content">
                    <div class="virtualscroller-listwrapper">
                        <div class="virtualscroller-item"></div>
                    </div>
                </div>
            </div>
        </div>
    `
}
const createVirtualScrollerItemTemplate = (itemData, options, index) => {
    if (!(options.createItemRender instanceof Function)) {
        return ``
    }
    return `<div class="virtualscroller-item" style="height: ${options.rowItemHeight}px;">${options.createItemRender(itemData, index)}</div>`
}

const createDefaultConfig = () => {
    return {
        /**
         * 滚动过程中渲染在可视区域的第一个元素数据在总列表中的索引
         */
        viewStartIndex: 0,
        /**
         * scroller-content 元素的内顶边距
         */
        contentElementOffsetY: 0,
        /**
         * scroller-content 元素的内顶边距可设置的最小值
         */
        contentElementOffsetYMin: 0,
        /**
         * scroller-content 元素的内顶边距可设置的最大值
         */
        contentElementOffsetYMax: 0,
        /**
         * 列表总高度
         */
        rowsAllHeight: 0,
        /**
         * 列表总长度
         */
        dataAllCount: 0,
        /**
         * 列表数据集
         */
        listData: [],
        /**
         * 当前显示到视图上的数据段
         */
        slicedListData: [],
        /**
         * 列表渲染器(函数)
         */
        createItemRender: null,
        /**
         * 滚动过程中渲染出的真实 DOM 个数
         */
        viewRenderCount: 0,
        /**
         * ...
         */
        isTriggerByUpdateCall: false
    }
}

const createDefaultProfile = () => {
    return {
        /**
         * 单行元素的高度
         */
        rowItemHeight: 20,
    }
}


class VirtualScroller {
    constructor(containerElement, profileOptions = {}) {
        this.options = Object.assign({}, createDefaultProfile(), profileOptions, createDefaultConfig())
        this.options.createItemRender = profileOptions.createItemRender
        this.outerContainerElement = containerElement
        this.containerElement = null
        this.eventHandlers = {}
        this._init()
    }

    _init() {
        this._initDOM()
        this._setClientRect()
        this._bindEvent()
    }

    setData(listData) {
        this._handleListDataChange(listData)
        this._insertHtml(this._sliceListData())
    }

    getRenderedData() {
        return this.options.slicedListData
    }

    updateData(callback) {
        if (!(callback instanceof Function)) {
            return
        }
        this.options.isTriggerByUpdateCall = true
        this._handleListDataChange(callback.call(this, this.options.listData, this.options.viewStartIndex, this.options.viewRenderCount))
        /**
         * 对于更新后的数据, 如果截取的数据段无法填满当前视口, 则需要调整截取起始位置并重新截取
         */
        const slicedListData = this._sliceListData()
        if (slicedListData.length >= this.options.viewRenderCount) {
            this._insertHtml(slicedListData)
            return
        }
        const vsWrapperElement = this.containerElement.getElementsByClassName(`virtualscroller-wrapper`)[0]
        const vsListWrapperElement = this.containerElement.getElementsByClassName(`virtualscroller-listwrapper`)[0]
        let scrollTop = vsWrapperElement.scrollTop
        if (scrollTop <= this.options.contentElementOffsetYMin) {
            scrollTop = this.options.contentElementOffsetYMin
        }
        if (scrollTop >= this.options.contentElementOffsetYMax) {
            scrollTop = this.options.contentElementOffsetYMax
        }
        this.options.contentElementOffsetY = scrollTop <= 0 ? 0 : scrollTop
        this.options.viewStartIndex = Math.floor((this.options.contentElementOffsetY / this.options.rowItemHeight)) || 0 
        this._insertHtml(this._sliceListData())
        vsListWrapperElement.style.transform = `translate3d(0, ${this.options.contentElementOffsetY}px, 5px)`
    }

    updateClientRect() {
        this._setClientRect()
        this.options.contentElementOffsetYMax = this.options.rowsAllHeight - this.options.containerElementClientRect.height
        this._insertHtml(this._sliceListData())
    }

    on(eventName, callback) {
        if (!eventName || typeof eventName != 'string' || !(callback instanceof Function)) {
            return
        }
        if (!this.eventHandlers[eventName]) {
            this.eventHandlers[eventName] = []
        }
        this.eventHandlers[eventName].push(callback)
    }

    /****************************** ******************************/
    /****************************** ******************************/

    _handleListDataChange(listData) {
        this.options.listData = listData
        this.options.dataAllCount = this.options.listData.length
        this.options.rowsAllHeight = this.options.dataAllCount * this.options.rowItemHeight
        this.options.contentElementOffsetYMax = this.options.rowsAllHeight - this.options.containerElementClientRect.height
        /**
         * 更新 content 节点高度, 使得容器滚动条正常显示
         */
        const vsContentElement = this.containerElement.getElementsByClassName(`virtualscroller-content`)[0]
        vsContentElement.style.height = `${this.options.dataAllCount * this.options.rowItemHeight}px`
    }

    _initDOM() {
        const vsOuterFragment = document.createRange().createContextualFragment(createPositionContainer(createVirtualScrollerTemplate()))
        document.body.appendChild(vsOuterFragment)
        const positionElement = document.body.lastElementChild
        /**
         * 虚拟滚动自身容器节点
         */
        const vsContainerElement = positionElement.firstElementChild
        /**
         * 虚拟滚动列表包裹层节点
         */
        const vsListWrapperElement = vsContainerElement.querySelector(`.virtualscroller-listwrapper`)
        /**
         * 虚拟滚动列表节点
         */
        const vsItemElement = vsListWrapperElement.firstElementChild
        /* ... */
        if (!this.options.rowItemHeight) {
            this.options.rowItemHeight = vsItemElement.getBoundingClientRect().height
        }
        this.outerContainerElement.appendChild(vsContainerElement)
        vsItemElement.parentElement.removeChild(vsItemElement)
        document.body.removeChild(positionElement)
        this.containerElement = vsContainerElement
    }

    _setClientRect() {
        /**
         * 获取自身容器尺寸
         */
        this.options.containerElementClientRect = this.containerElement.getBoundingClientRect()
        /**
         * 设置滚动内层节点尺寸
         */
        const vsContentElement = this.containerElement.getElementsByClassName(`virtualscroller-content`)[0]
        vsContentElement.style.minHeight = `${this.options.containerElementClientRect.height}px`
        vsContentElement.style.height = `${this.options.dataAllCount * this.options.rowItemHeight}px`
        /**
         * 设置列表包裹层节点尺寸
         */
        const vsListWrapperElement = this.containerElement.querySelector(`.virtualscroller-listwrapper`)
        vsListWrapperElement.style.minHeight = `${this.options.containerElementClientRect.height}px`
        vsListWrapperElement.style.height = `${this.options.containerElementClientRect.height}px`
        /**
         * 设置滚动内层节点尺寸
         */
        this.options.viewRenderCount = Math.ceil(this.options.containerElementClientRect.height / this.options.rowItemHeight)
    }

    _bindEvent() {
        const vsWrapperElement = this.containerElement.getElementsByClassName(`virtualscroller-wrapper`)[0]
        const vsListWrapperElement = this.containerElement.getElementsByClassName(`virtualscroller-listwrapper`)[0]
        vsWrapperElement.addEventListener('scroll', (evte) => {
            if (this.options.isTriggerByUpdateCall) {
                this.options.isTriggerByUpdateCall = false
                return
            }
            let scrollTop = evte.currentTarget.scrollTop
            let isTouchThreshold = false
            if (scrollTop <= this.options.contentElementOffsetYMin) {
                isTouchThreshold = true
                scrollTop = this.options.contentElementOffsetYMin
                this._emit(EVENT_CONSTANCE.SCROLL_TO_TOP)
            }
            if (scrollTop >= this.options.contentElementOffsetYMax) {
                isTouchThreshold = true
                scrollTop = this.options.contentElementOffsetYMax
                this._emit(EVENT_CONSTANCE.SCROLL_TO_BOTTOM)
            }
            this.options.contentElementOffsetY = scrollTop <= 0 ? 0 : scrollTop
            this.options.viewStartIndex = Math.floor((this.options.contentElementOffsetY / this.options.rowItemHeight)) || 0 
            this._insertHtml(this._sliceListData())
            vsListWrapperElement.style.transform = `translate3d(0, ${this.options.contentElementOffsetY}px, 5px)`
            if (!isTouchThreshold) {
                this._emit(EVENT_CONSTANCE.SCROLLING)
            }
        })
    }

    _sliceListData() {
        this.options.slicedListData = this.options.listData.slice(this.options.viewStartIndex, this.options.viewStartIndex + this.options.viewRenderCount)
        return this.options.slicedListData
    }

    _insertHtml(sliceListData) {
        const vsListwrapperElement = this.containerElement.getElementsByClassName(`virtualscroller-listwrapper`)[0]
        const htmlString = 
            sliceListData
            .map((item, index) => {
                return createVirtualScrollerItemTemplate(item, this.options, index)
            })
            .join('\n')
        vsListwrapperElement.innerHTML = htmlString
    }

    _emit(eventName, ...args) {
        const events = this.eventHandlers[eventName]
        for (let i = 0; i < events.length; i++) {
            if (events[i] instanceof Function) {
                events[i].call(undefined, ...args)
            }
        } 
    }
}

VirtualScroller.EVENT_CONSTANCE = EVENT_CONSTANCE
