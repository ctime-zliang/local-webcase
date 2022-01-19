/**
 * 绑定事件
 * @param {htmllement | string} host 事件的真实宿主元素或用于捕获宿主的选择器
 * @param {string} eventName 事件名称
 * @param {string} selector 触发事件的元素选择器(可选) * 
 * @param {function} callback 事件处理器
 * @param {boolean} capture 设定以在冒泡/捕获阶段执行事件
 * @return {undefined}
 */
async function ven$bindEvent(host, eventName, selector = null, callback = null, capture = false) {
    let hostElement = host
    if (typeof host === 'string') {
        hostElement = document.querySelector(host)
    }
    if (!hostElement || !eventName || typeof eventName !== 'string' || typeof arguments[2] == 'undefined') {
        return
    }
    let _capture = !!capture
    let _selector = selector
    let _callback = callback
    if (typeof selector === 'function') {
        _callback = selector
        _capture = !!callback
        _selector = null
    }
    hostElement.addEventListener(eventName, function(e) {
        if (!_selector) {
            _callback && _callback.call(this, e)
            return
        }
        const targetCapture = _captureTargetElement(_selector, e.target, hostElement)
        if (targetCapture) {
            _callback && _callback.call(targetCapture, e)
        }
    }, _capture)
}
function _captureTargetElement(selector, startChildElement, endParentElemet) {
    try {
        const targetElementsArray = Array.from(endParentElemet.querySelectorAll(selector))
        if (!targetElementsArray.length) {
            return null
        }
        let startFindElement = startChildElement
        while (startFindElement) {
            if (startFindElement === endParentElemet.parentElement) {
                return null
            }
            if (targetElementsArray.includes(startFindElement)) {
                return startFindElement
            }
            startFindElement = startFindElement.parentElement
        }
        return startFindElement
    } catch (e) {
        console.warn(e)
        return null
    }
}