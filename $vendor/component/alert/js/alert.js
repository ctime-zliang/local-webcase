function __AlertFindTargetByClassName(element, className, eventPath, index) {
    const nowElement = eventPath[index]
    if ((nowElement.nodeType !== 1 && nowElement.nodeType !== 3) || !nowElement) {
        return null
    }
    if (element.classList.contains(className)) {
        return element
    }
    return __AlertFindTargetByClassName(element.parentElement, className, eventPath, ++index)
}

class AlertManager {
    static STATUS_CLOSE = 'close'
    static STATUS_OPEN = 'open'
    static status = 'close'
    static containerElemeent = null
    static contentElement = null
    static btnsWrapperElement = null
    static callback = null
    static pointerdownX = 0
    static pointerdownY = 0
    static btns = []
    static defaultConfirmBtn = { type: 'confirm', tag: 'confirm', text: '确认' }
    static defaultCancelBtn = { type: 'cancel', tag: 'cancel', text: '取消' }
    static defaultCloseBtn = { type: 'close', tag: 'close', text: '关闭' }

    static init() {
        if (document.querySelector('.alertmgr-container')) {
            return
        }
        this.btns = [this.defaultConfirmBtn]
        /* ... */
        this._touchstartHandler = this._touchstartHandler.bind(this)
        this._touchendHandler = this._touchendHandler.bind(this)
        this._mousedownHandler = this._mousedownHandler.bind(this)
        this._mouseupHandler = this._mouseupHandler.bind(this)
        this._contextmenuHandler = this._contextmenuHandler.bind(this)
        this._rippleAnimationEndHandler = this._rippleAnimationEndHandler.bind(this)
        /* ... */
        document.body.appendChild(document.createRange().createContextualFragment(this._template()))
        this.containerElemeent = document.querySelector('.alertmgr-container')
        this.contentElement = this.containerElemeent.querySelector('.alertmgr-message-content')
        this.btnsWrapperElement = this.containerElemeent.querySelector('.alertmgr-btns-wrapper')
        /* ... */
        this._updateBtnsView()
        this._bindEvent()
    }

    static open(message, options = {}) {
        if (options.callback) {
            this.callback = options.callback
        }
        if (options.btns) {
            this.btns = options.btns
            this._updateBtnsView()
        }
        /* ... */        
        this.contentElement.innerHTML = message
        this.containerElemeent.classList.add('alertmgr-container-show')
    }

    static close() {
        this.containerElemeent.classList.remove('alertmgr-container-show')
        this.callback = null
    }

    static setCallback(callback) {
        this.callback = callback
    }

    static setBtns(btns) {
        this.btns = btns
        this._updateBtnsView()
    }

    /****************************** ******************************/
    /****************************** ******************************/

    static _template() {
        return `
            <section class="alertmgr-container">
                <div class="alertmgr-position-wrapper">
                    <div class="alertmgr-lock alertmgr-lock-visibility"></div>
                    <div class="alertmgr-wrapper">
                        <div class="alertmgr-message-wrapper">
                            <div class="alertmgr-message-content"></div>
                        </div>
                        <div class="alertmgr-btns-wrapper"></div>
                    </div>
                </div>
            </section>
        `
    }

    static _updateBtnsView() {
        let htmlString = ``
        this.btns.forEach((item) => {
            htmlString += `
                <button class="alertmgr-btn alertmgr-${item.type}-btn" data-tagitem="${item.tag}"><span class="alertmgr-btn-text">${item.text}</span></button>
            `
        })
        this.btnsWrapperElement.innerHTML = htmlString
    }

    static _bindEvent() {
        this.btnsWrapperElement.addEventListener('touchstart', this._touchstartHandler)
        this.btnsWrapperElement.addEventListener('touchend', this._touchendHandler)
        this.btnsWrapperElement.addEventListener('mousedown', this._mousedownHandler)
        this.btnsWrapperElement.addEventListener('mouseup', this._mouseupHandler)
        this.containerElemeent.addEventListener('contextmenu', this._contextmenuHandler)
    }

    static _touchstartHandler(e) {
        const toucher0 = e.changedTouches[0]
        e.preventDefault()
        this.pointerdownX = toucher0.clientX
        this.pointerdownY = toucher0.clientY
        this._rippleAnimation(e)
    }

    static _touchendHandler(e) {
        const toucher0 = e.changedTouches[0]
        if (Math.abs(toucher0.clientX - this.pointerdownX) < 8 && Math.abs(toucher0.clientY - this.pointerdownY) < 8) {
            const target = __AlertFindTargetByClassName(e.target, 'alertmgr-btn', e.path || (e.componsedPath && e.componsedPath()), 0)
            if (target && this.callback) {
                this.callback.call(this, target.getAttribute('data-tagitem'))
            }
        }
    }

    static _mousedownHandler(e) {
        if (e.button !== 0) {
            return
        }
        e.preventDefault()
        this._rippleAnimation(e)
        this.pointerdownX = e.clientX
        this.pointerdownY = e.clientY
    }

    static _mouseupHandler(e) {
        if (e.button !== 0) {
            return
        }
        if (Math.abs(e.clientX - this.pointerdownX) < 8 && Math.abs(e.clientY - this.pointerdownY) < 8) {
            const target = __AlertFindTargetByClassName(e.target, 'alertmgr-btn', e.path || (e.componsedPath && e.componsedPath()), 0)
            if (target && this.callback) {
                this.callback.call(this, target.getAttribute('data-tagitem'))
            }
        }
    }

    static _contextmenuHandler(e) {
        e.preventDefault()
    }

    static _rippleAnimation(e) {
        let evte = e
        if (typeof e.changedTouches !== 'undefined') {
            evte = e.changedTouches[0]
        }
        const target = __AlertFindTargetByClassName(e.target, 'alertmgr-btn', e.path || (e.componsedPath && e.componsedPath()), 0)
        if (target.nodeName.toUpperCase() !== 'BUTTON') {
            return
        }
        const btnClientWidth = target.offsetWidth
        const spanElement = document.createElement('span')
        const targetClientRect = target.getBoundingClientRect()
        const x = evte.pageX - targetClientRect.left - btnClientWidth / 2
        const y = evte.pageY - targetClientRect.top - btnClientWidth / 2
		if (target.firstChild) {
			target.insertBefore(spanElement, target.firstChild)
		} else {
			target.appendChild(spanElement)
		}
        spanElement.classList.add('ripple')
        spanElement.addEventListener('animationend', this._rippleAnimationEndHandler)
		spanElement.style.cssText = 'width: ' + btnClientWidth + 'px; height: ' + btnClientWidth + 'px; top: ' + y + 'px; left: ' + x + 'px;'
		spanElement.classList.add('ripple-animation')
    }

    static _rippleAnimationEndHandler(e) {
        e.currentTarget.removeEventListener('animationend', this._rippleAnimationEndHandler)
        e.currentTarget.parentNode.removeChild(e.currentTarget)
    }
}

