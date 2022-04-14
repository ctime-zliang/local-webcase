/*
    util.js
 */

window.$util = {
    /**
     * @method jsonDeepCopy
     * @desc 拷贝JSON数据
     * @param {Object} data JSON-Data
     * @return {Object|Null}
     */
    jsonDeepCopy(
        data = {}
    ) {
        let res = null
        /* 防止拷贝出错时中断脚本 */
        try{
            res = JSON.parse(JSON.stringify(data))
        } catch (e) {
            res = null
            // 调用console接口即可完成其他操作
            console.error(e) 
        }

        return res
    },
    /**
     * @method renderOprTips
     * @desc 渲染提示项
     * @param {Element} el 目标元素
     * @param {String} text 需要提示的文本
     * @return {Undefined}
     */
    renderOprTips(
        el,
        text = ``
    ) {
        if (!el || el.nodeType !== 1) {
            return
        }
        el.textContent = (text || '').trim()
    },
    /**
     * @method mergeOptions
     * @desc 合并参数
     * @param {Object} defaultOptions 默认参数配置项
     * @param {Object} options 导入参数项
     * @return {Object}
     */
    mergeOptions( 
        defaultOptions = {},
        options = {}
    ) {
        let opts = {}    
        /*
            这里不采用{...}运算符
            即不允许在this.options中写入额外的key 
         */
        Object.keys(defaultOptions).forEach((item, index) => {
            opts[item] = typeof options[item] !== 'undefined' ? options[item] : defaultOptions[item]
        })
    
        return opts
    },
    /**
     * @method getBoundingClientRect
     * @desc 获取元素位置属性
     * @param {Element} element 目标元素
     * @return {Object}
     */
    getBoundingClientRect(
        element
    ) {
        return element.getBoundingClientRect()
    },
    /**
     * @method emitCustomEvent
     * @desc 派发客户端事件
     * @param {String} dispatchEventName 需要派发的事件名
     * @param {Object} data 附带参数
     * @return {Undefined}
     */
    emitCustomEvent(
        dispatchEventName,
        data = {}
    ) {
        let event = new CustomEvent(
            dispatchEventName, 
            {
                detail: {
                    ...data
                }
            }
        )
        // 派发
        document.dispatchEvent( event )
    },
    /**
     * @method groupArray
     * @desc 分割数组
     * @param {Array} array 需要切割的数组
     * @param {Number} len 分割份数
     * @return {Array}
     */
    groupArray(
        array,
        len
    ) {
        let index = 0
        let newArray = []
        while (index < array.length) {
            newArray.push( array.slice(index, index += len))
        }
        return newArray
    }
}