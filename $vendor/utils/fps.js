;(function(){
    const RuntimeVariable = {
        url: window.location.href,
        className: '_fps-container',
        element: null,
        isSetShow: false,
        insertStyleText: `
            ._fps-container{
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
            ._fps-container-warning{
                color: #ff6600;
            }
            ._fps-container-serious{
                color: #ff0000;
            }
        `,
        insertStyleError: false,
        frame: 0,
        allFrameCount: 0,
        lastTime: performance.now(),
        lastFrameTime: performance.now(),
        callback: new Function(),
        lastFPSNumber: 0,
        interval: 300,
        serious: [0, 19],
        warning: [20, 39]
    }

    const insertStyle = function(cssText) {
        const style = document.createElement('style')
        const head = document.head || document.getElementsByTagName('head')[0]
        let insertStyleError = false        
        style.type = 'text/css'
        if (style.styleSheet) { 
            try {
                style.styleSheet.cssText = cssText
            } catch (e) {
                insertStyleError = true
            }           
        } else {
            style.appendChild(document.createTextNode(cssText))
        }
        head.appendChild(style)
        return insertStyleError
    }
    
    const insertElement = function(className) {
        const el =document.createElement('div')
        const body = document.body || document.documentElement
        el.className = className
        body.appendChild(el)
        return el
    }
    
    const getRAF = function(){
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60)
            }
        )
    }

    const loop = function() {
        let now = performance.now()
        let fps = Math.round(1000 / (now - RuntimeVariable.lastFrameTime))
        RuntimeVariable.lastFrameTime = now
        RuntimeVariable.frame++        
        if (now - RuntimeVariable.lastTime >= RuntimeVariable.interval) {
            fps = Math.round((RuntimeVariable.frame * 1000) / (now - RuntimeVariable.lastTime))
            RuntimeVariable.callback(fps)
            RuntimeVariable.frame = 0
            RuntimeVariable.lastTime = now
        }
        RAF(loop)
    }
    
    const showCallback = function(fps = 0) {
        if (RuntimeVariable.lastFPSNumber === fps) {
            return
        }
        RuntimeVariable.lastFPSNumber = fps
        RuntimeVariable.element.innerHTML = `FPS: ${fps}`
        if (fps >= RuntimeVariable.warning[0] && fps <= RuntimeVariable.warning[1]) {
            RuntimeVariable.element.classList.add('_fps-container-warning')
        } else {
            RuntimeVariable.element.classList.remove('_fps-container-warning')
        }
        if (fps >= RuntimeVariable.serious[0] && fps <= RuntimeVariable.serious[1]) {
            RuntimeVariable.element.classList.add('_fps-container-serious')
        } else {
            RuntimeVariable.element.classList.remove('_fps-container-serious')
        }
        if (!RuntimeVariable.isSetShow) {
            RuntimeVariable.isSetShow = true
            RuntimeVariable.element.style.display = 'block'
        }        
    }

    let RAF = getRAF()

    RuntimeVariable.callback = showCallback
    RuntimeVariable.insertStyleError = insertStyle(RuntimeVariable.insertStyleText)
    RuntimeVariable.element = insertElement(RuntimeVariable.className)
    if (!RuntimeVariable.insertStyleError) { 
        loop()
    }
})()

