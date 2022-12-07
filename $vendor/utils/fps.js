;(() => {
	const config = {
		/**
		 * 帧率刷新间隔(ms)
		 */
		interval: 100,
		/**
		 * 帧率告警阈值边界
		 */
		serious: [0, 19],
		warning: [20, 29],
	}

	const styleProfile = {
		cssText: `
            ._fps-monitor-container {
                display: block;
                position: fixed; 
                top: 0;
                right: 0;
                line-height: 14px;
                padding: 2px 4px;
                border: 1px solid #dcdcdc;
                background-color: rgba(245, 245, 245, 1);
                color: #049404;
                font-size: 12px;
                font-weight: 400;
                box-sizing: border-box;
                z-index: 99999999;
                -webkit-user-select: none;
                -moz-user-select: none;
                user-select: none;
                -webkit-transform: translate3d(0, 0, 5px);
                -moz-transform: translate3d(0, 0, 5px);
                transform: translate3d(0, 0, 5px);
            }
            ._fps-monitor-tips-warning {
                color: #ff6600;
            }
            ._fps-monitor-tips-serious {
                color: #ff0000;
            }
        `,
	}

	const createHtmlString = () => {
		const htmlString = `
            <div id="_fpsMonitorContainer" class="_fps-monitor-container">
                <div id="_fpsMonitorWrapper">
                    <div data-tagitem="_fps-raf-count"></div>
                    <div data-tagitem="_fps-raf-interval-count"></div>
                    <div data-tagitem="_fps-ric-count"></div>
                </div>
            </div>
        `
		return htmlString
	}

	const initViewStyle = cssText => {
		const styleElement = document.createElement('style')
		const headElement = document.head || document.getElementsByTagName('head')[0]
		let initStyleError = false
		styleElement.type = 'text/css'
		if (styleElement.styleSheet) {
			try {
				styleElement.styleSheet.cssText = cssText
			} catch (e) {
				initStyleError = true
			}
		} else {
			styleElement.appendChild(document.createTextNode(cssText))
		}
		headElement.appendChild(styleElement)
		return initStyleError
	}

	const initViewElement = () => {
		const rootElement = document.body || document.documentElement
		rootElement.appendChild(document.createRange().createContextualFragment(createHtmlString()))
	}

	const initElementHandler = runtimeConfig => {
		runtimeConfig.containerElement = document.getElementById('_fpsMonitorContainer')
		runtimeConfig.wrapperElement = document.getElementById('_fpsMonitorWrapper')
		runtimeConfig.rAFCountItemElement = runtimeConfig.containerElement.querySelector('[data-tagitem="_fps-raf-count"]')
		runtimeConfig.rAFIntervalCountItemElement = runtimeConfig.containerElement.querySelector('[data-tagitem="_fps-raf-interval-count"]')
		runtimeConfig.rICCountItemElement = runtimeConfig.containerElement.querySelector('[data-tagitem="_fps-ric-count"]')
	}

	const initRAF = () => {
		const vendors = ['webkit', 'moz']
		for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
		}
	}

	/************************************ ************************************/
	/************************************ ************************************/
	/************************************ ************************************/

	const runtimeConfig = {
		...config,
		...styleProfile,
	}

	const initProfile = () => {
		runtimeConfig._rAFSetCountLastTime = performance.now()
		runtimeConfig._rAFCountInEveryInterval = 0
		runtimeConfig._rICSetCountLastTime = performance.now()
		runtimeConfig._rICCountInEveryInterval = 0
		/* ... */
		runtimeConfig.rAFCount = 0
		runtimeConfig.rAFIntervalCount = 0
		runtimeConfig.rICCount = 0
		/* ... */
		window.fpsRuntimeConfig = runtimeConfig
	}

	const countRAF = timeStamp => {
		const now = performance.now()
		runtimeConfig._rAFCountInEveryInterval++
		if (now - runtimeConfig._rAFSetCountLastTime >= runtimeConfig.interval) {
			runtimeConfig.rAFCount = runtimeConfig._rAFCountInEveryInterval / ((now - runtimeConfig._rAFSetCountLastTime) / 1000)
			runtimeConfig.rAFIntervalCount = runtimeConfig._rAFCountInEveryInterval
			renderView()
			/* ... */
			runtimeConfig._rAFCountInEveryInterval = 0
			runtimeConfig._rAFSetCountLastTime = now
		}
		window.requestAnimationFrame(countRAF)
	}

	const countRIC = deadline => {
		const now = performance.now()
		runtimeConfig._rICCountInEveryInterval++
		if (now - runtimeConfig._rICSetCountLastTime >= 1000) {
			runtimeConfig.rICCount = runtimeConfig._rICCountInEveryInterval
			renderView()
			/* ... */
			runtimeConfig._rICCountInEveryInterval = 0
			runtimeConfig._rICSetCountLastTime = now
		}
		window.requestIdleCallback(countRIC)
	}

	const renderView = () => {
		runtimeConfig.rAFCountItemElement.innerHTML = `RAF COUNT: <span>${runtimeConfig.rAFCount.toFixed(4)}</span>`
		runtimeConfig.rAFIntervalCountItemElement.innerHTML = `RAF COUNT: <span>${runtimeConfig.rAFIntervalCount.toFixed(4)}</span>`
		runtimeConfig.rICCountItemElement.innerHTML = `RIC COUNT: <span>${runtimeConfig.rICCount.toFixed(4)}</span>`
		if (runtimeConfig.rAFCount >= runtimeConfig.warning[0] && runtimeConfig.rAFCount <= runtimeConfig.warning[1]) {
			runtimeConfig.wrapperElement.classList.add('_fps-monitor-tips-warning')
		} else {
			runtimeConfig.wrapperElement.classList.remove('_fps-monitor-tips-warning')
		}
		if (runtimeConfig.rAFCount >= runtimeConfig.serious[0] && runtimeConfig.rAFCount <= runtimeConfig.serious[1]) {
			runtimeConfig.wrapperElement.classList.add('_fps-monitor-tips-serious')
		} else {
			runtimeConfig.wrapperElement.classList.remove('_fps-monitor-tips-serious')
		}
		/* ... */
		if (runtimeConfig.renderCallback instanceof Function) {
			runtimeConfig.renderCallback(runtimeConfig)
		}
	}

	const main = () => {
		initViewStyle(runtimeConfig.cssText)
		initViewElement()
		initProfile()
		initElementHandler(runtimeConfig)
		initRAF()
		window.requestAnimationFrame(countRAF)
		window.requestIdleCallback(countRIC)
	}

	window.setTimeout(main)
})()
