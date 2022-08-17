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
    static defaultConfirmBtn = { type: 'confirm', tag: 'confirm', text: '确认' }
    static defaultCancelBtn = { type: 'cancel', tag: 'cancel', text: '取消' }
    static defaultCloseBtn = { type: 'close', tag: 'close', text: '关闭' }
    /****************************** ******************************/
    /****************************** ******************************/
    static _containerElemeent = null
    static _contentElement = null
    static _wrapperElement = null
    static _btnsWrapperElement = null
    static _locakElement = null
    static _callback = null
    static _pointerdownX = 0
    static _pointerdownY = 0
    static _btns = []

    static init() {
        if (document.querySelector('.alertmgr-container')) {
            return
        }
        this._btns = [this.defaultConfirmBtn, this.defaultCancelBtn]
        /* ... */
        this._touchstartHandler = this._touchstartHandler.bind(this)
        this._touchendHandler = this._touchendHandler.bind(this)
        this._mousedownHandler = this._mousedownHandler.bind(this)
        this._mouseupHandler = this._mouseupHandler.bind(this)
        this._contextmenuHandler = this._contextmenuHandler.bind(this)
        this._rippleAnimationEndHandler = this._rippleAnimationEndHandler.bind(this)
        /* ... */
        document.body.appendChild(document.createRange().createContextualFragment(this._template()))
        this._containerElemeent = document.querySelector('.alertmgr-container')
        this._locakElement = this._containerElemeent.querySelector('.alertmgr-lock')
        this._wrapperElement = this._containerElemeent.querySelector('.alertmgr-wrapper')
        this._contentElement = this._containerElemeent.querySelector('.alertmgr-message-content')
        this._btnsWrapperElement = this._containerElemeent.querySelector('.alertmgr-btns-wrapper')
        /* ... */
        this._updateBtnsView()
        this._bindEvent()
    }

    static open(message, options = {}) {
        if (options instanceof Function) {
            this._callback = options
        } else {
            if (options.callback) {
                this._callback = options.callback
            }
            if (options.btns) {
                this._btns = options.btns
                this._updateBtnsView()
            }
        }
        /* ... */        
        this._contentElement.innerHTML = message
        this._containerElemeent.classList.add('alertmgr-container-show')
        this._wrapperElement.classList.add('alertmgr-wrapper-entrystart', 'alertmgr-transition-duringshort')
        this._locakElement.classList.add('alertmgr-lock-entrystart', 'alertmgr-transition-duringshort')
        /* ... */
        this._fadeTask(
            () => {
                this._wrapperElement.classList.remove('alertmgr-wrapper-entrystart')
                this._locakElement.classList.remove('alertmgr-lock-entrystart')
            },
            () => {
                this._wrapperElement.classList.remove('alertmgr-transition-duringshort')
                this._locakElement.classList.remove('alertmgr-transition-duringshort')
            }
        )
    }

    static close() {
        this._containerElemeent.classList.remove('alertmgr-container-show')
    }

    static bindCallback(callback) {
        this._callback = callback
        return this
    }

    static setBtns(_btns) {
        this._btns = _btns
        this._updateBtnsView()
        return this
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
        this._btns.forEach((item) => {
            htmlString += `
                <button class="alertmgr-btn alertmgr-${item.type}-btn" data-tagitem="${item.tag}">
                    <span class="alertmgr-btn-text">${item.text}</span>
                </button>
            `
        })
        this._btnsWrapperElement.innerHTML = htmlString
    }

    static _bindEvent() {
        this._btnsWrapperElement.addEventListener('touchstart', this._touchstartHandler)
        this._btnsWrapperElement.addEventListener('touchend', this._touchendHandler)
        this._btnsWrapperElement.addEventListener('mousedown', this._mousedownHandler)
        this._btnsWrapperElement.addEventListener('mouseup', this._mouseupHandler)
        this._containerElemeent.addEventListener('contextmenu', this._contextmenuHandler)
    }

    static _touchstartHandler(e) {
        e.preventDefault()
        const toucher0 = e.changedTouches[0]
        this._pointerdownX = toucher0.clientX
        this._pointerdownY = toucher0.clientY
        this._rippleAnimation(e)
    }

    static _touchendHandler(e) {
        e.preventDefault()
        const toucher0 = e.changedTouches[0]
        if (Math.abs(toucher0.clientX - this._pointerdownX) < 8 && Math.abs(toucher0.clientY - this._pointerdownY) < 8) {
            const target = __AlertFindTargetByClassName(e.target, 'alertmgr-btn', e.path || (e.componsedPath && e.componsedPath()), 0)
            if (target && this._callback) {
                this._callback.call(this, target.getAttribute('data-tagitem'))
            }
        }
    }

    static _mousedownHandler(e) {
        e.preventDefault()
        if (e.button !== 0) {
            return
        }
        this._rippleAnimation(e)
        this._pointerdownX = e.clientX
        this._pointerdownY = e.clientY
    }

    static _mouseupHandler(e) {
        e.preventDefault()
        if (e.button !== 0) {
            return
        }
        if (Math.abs(e.clientX - this._pointerdownX) < 8 && Math.abs(e.clientY - this._pointerdownY) < 8) {
            const target = __AlertFindTargetByClassName(e.target, 'alertmgr-btn', e.path || (e.componsedPath && e.componsedPath()), 0)
            if (target && this._callback) {
                this._callback.call(this, target.getAttribute('data-tagitem'))
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
        spanElement.classList.add('alertmgr-ripple')
        spanElement.addEventListener('animationend', this._rippleAnimationEndHandler)
		spanElement.style.cssText = 'width: ' + btnClientWidth + 'px; height: ' + btnClientWidth + 'px; top: ' + y + 'px; left: ' + x + 'px;'
		spanElement.classList.add('alertmgr-ripple-animation')
    }

    static _rippleAnimationEndHandler(e) {
        e.currentTarget.removeEventListener('animationend', this._rippleAnimationEndHandler)
        e.currentTarget.parentNode.removeChild(e.currentTarget)
    }

    static _fadeTask(start, end, d = 300) {
        window.setTimeout(() => {
            window.requestAnimationFrame(() => {
                start()
                this._wrapperElement.classList.remove('alertmgr-wrapper-entrystart')
                this._locakElement.classList.remove('alertmgr-lock-entrystart')
                window.setTimeout(() => {
                    end()
                    this._wrapperElement.classList.remove('alertmgr-transition-duringshort')
                    this._locakElement.classList.remove('alertmgr-transition-duringshort')
                }, d)
            })
        })
    }
}

