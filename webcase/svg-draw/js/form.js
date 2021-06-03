/*
    form.js
 */

window.$form = {
    /**
     * @method initFormSelect
     * @desc 初始化表单SELECT控件OPTIONS选项
     * @param {Element} formEl 目标节点对象
     * @param {Object} select 所有需要初始化的SELECT合集
     * @returns {Undefined}
     */
    initFormSelect(
        formEl,
        select = {}
    ){
        if( !formEl || +formEl.nodeType !== 1 ){            
            return
        }

        let selectEl
        let string

        // 遍历
        Object.keys( select ).forEach((outerItem, outerIndex)=>{
            string = ''
            selectEl = formEl.querySelector( `[name="${outerItem}"]` )
            if( selectEl ){
                Object.keys( select[outerItem] ).forEach((innerItem, innerIndex)=>{
                    string += `
                        <option value="${innerItem}">${ select[outerItem][innerItem]['label'] }</option>
                    `
                })
                selectEl.innerHTML = string
            }
        })
    },
    /**
     * @method initFormData
     * @desc 初始化表单数据
     * @param {Element} formEl 目标节点对象
     * @param {Object} data 表单初始化时传入的JSON
     * @returns {Undefined}
     */
    initFormData(
        formEl,
        data = {}
    ){
        if( !formEl || +formEl.nodeType !== 1 ){            
            return
        }

        let el

        // 遍历
        Object.keys( data || {} ).forEach((item, index)=>{
            el = formEl.querySelector( `[name="${item}"]` )
            if( el ){
                el.value = data[item]['value']
                if( data[item]['_readonly'] ){
                    el.setAttribute('readonly', 'readonly')
                }
                if( data[item]['_eventName'] ){
                    el.setAttribute('data-eventName', data[item]['_eventName'])
                }
            }
        })
    },
    /**
     * @method bindFormEvent
     * @desc 绑定表单控件事件
     * @param {Element} formEl 目标节点对象
     * @param {String} eventType 目标事件类型名称
     * @param {String} dispatchEventName 派发的事件名称
     * @returns {Undefined}
     */
    bindFormEvent(
        formEl,
        eventType,
        dispatchEventName
    ){
        if( 
            !formEl || +formEl.nodeType !== 1
            || !eventType
            || !dispatchEventName
        ){            
            return
        }

        let els = formEl.querySelectorAll( `[data-eventName]` ) || []

        if( els && els.length ){
            els.forEach((item, index)=>{
                if( item ){                    
                    // 监听事件
                    item.addEventListener(eventType, function( evte ){
                        // 派发自定义的客户端事件
                        window.$util.emitCustomEvent(
                            dispatchEventName, 
                            {
                                value: evte.target.value,
                                key: evte.target.name
                            }
                        )
                    }, false)
                }
            })
        }
    },
    /**
     * @method initSelectTips
     * @desc 初始化Tips提示语
     * @param {Element} el 目标节点对象
     * @param {Object} formData 表单数据对象
     * @param {Object} tipsData Tips数据对象
     * @returns {Undefined}
     */
    initSelectTips(
        el,
        formData = {},
        tipsData = {}
    ){
        if( !el || +el.nodeType !== 1 ){            
            return
        }

        let value

        // 遍历
        Object.keys( tipsData ).forEach((item, index)=>{
            if( formData[item] ){
                value = formData[item]['value']
                el.textContent = ( tipsData[item][String( value )] || '' ).trim()
            }
        })
    },
}