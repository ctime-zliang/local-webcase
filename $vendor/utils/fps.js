;(() => {
    /*
        自定义必选配置项
     */
    const config = {
        /* 帧率刷新间隔(ms) */
        interval: 100,
        /* 帧率告警阈值边界 */
        serious: [0, 19],
        warning: [20, 39]
    }

    const styleProfile = {
        /* 样式设置 */
        cssText: `
            ._fps-monitor-container {
                display: none;
                position: fixed; 
                top: 0;
                right: 0;
                line-height: 14px;
                padding: 4px 8px;
                border: 1px solid #dcdcdc;
                background-color: rgba(245, 245, 245, 0.75);
                color: #049404;
                font-size: 14px;
                font-weight: 400;
                box-sizing: border-box;
                z-index: 99999999;
                -webkit-user-select: none;
                -moz-user-select: none;
                user-select: none;
            }
            ._fps-monitor-tips-warning {
                color: #ff6600;
            }
            ._fps-monitor-tips-serious {
                color: #ff0000;
            }
        `
    }

    const initFPSViewStyle = (cssText) => {
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

    const initFPSViewElement = () => {
        const containerElement = document.createElement('div')
        const bodyElement = document.body
        containerElement.className = '_fps-monitor-container'
        bodyElement.appendChild(containerElement)
        return containerElement
    }

    const initRAF = () => {
        const vendors = ['webkit', 'moz']
        let lastTime = 0
        for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame']
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame']
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                const currTime = new Date().getTime()
                const timeToCall = Math.max(0, 16 - (currTime - lastTime))
                const id = window.setTimeout(function() { 
                    callback(currTime + timeToCall)
                }, timeToCall)
                lastTime = currTime + timeToCall
                return id
            }
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                window.clearTimeout(id)
            }
        }
    }

    /************************************ ************************************/
    /************************************ ************************************/
    /************************************ ************************************/

    const initRAF2 = () => {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60)
            }
        )
    }

    const runtimeConfig = {
        ...config,
        ...styleProfile,
    }
    const initProfile = () => {
        runtimeConfig.lastTime = performance.now()
        runtimeConfig.frameCount = 0
        runtimeConfig.fps = 0
        runtimeConfig.rafTimeStamp = 0
        runtimeConfig.rafCount = 0
    }
    const countFrames = (rafTimeStamp) => {
        runtimeConfig.rafTimeStamp = rafTimeStamp
        const now = performance.now()
        runtimeConfig.frameCount++
        if (now - runtimeConfig.lastTime >= runtimeConfig.interval) {
            runtimeConfig.fps = (runtimeConfig.frameCount * 1000) / (now - runtimeConfig.lastTime)
            runtimeConfig.rafCount = runtimeConfig.frameCount / ((now - runtimeConfig.lastTime) / 1000)
            showFPS()
            /* ... */
            runtimeConfig.frameCount = 0
            runtimeConfig.lastTime = now
        }
        window.requestAnimationFrame(countFrames)
    }
    const showFPS = () => {
        runtimeConfig.container.innerHTML = `
            <div>FPS COUNT: ${runtimeConfig.fps.toFixed(4)}</div>
            <div>RAF COUNT: ${runtimeConfig.rafCount.toFixed(4)}</div>
        `
        if (runtimeConfig.fps >= runtimeConfig.warning[0] && runtimeConfig.fps <= runtimeConfig.warning[1]) {
            runtimeConfig.container.classList.add('_fps-monitor-tips-warning')
        } else {
            runtimeConfig.container.classList.remove('_fps-monitor-tips-warning')
        }
        if (runtimeConfig.fps >= runtimeConfig.serious[0] && runtimeConfig.fps <= runtimeConfig.serious[1]) {
            runtimeConfig.container.classList.add('_fps-monitor-tips-serious')
        } else {
            runtimeConfig.container.classList.remove('_fps-monitor-tips-serious')
        }
        runtimeConfig.container.style.display = 'block'
        /* ... */
        if (runtimeConfig.renderCallback instanceof Function) {
            runtimeConfig.renderCallback(runtimeConfig)
        }
    }

    const main = () => {
        runtimeConfig.initStyleError = initFPSViewStyle(runtimeConfig.cssText)
        runtimeConfig.container = initFPSViewElement()
        initProfile()
        initRAF()
        countFrames(performance.now())
    }

    window.setTimeout(main)
})();