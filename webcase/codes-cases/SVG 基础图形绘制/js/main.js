/* 
    main.js
 */
const USER_EVENT = 'inputFormEvent'
const FORM_INPUT_EL_EVENT = 'input'
const FORM_ID = 'controllForm'
const OPRTIPS_ID = 'oprTips'
const SVG_CANVAS_ID = 'svgCanvas'


/* 初始化表单SELECT控件 */
window.$form.initFormSelect(
    document.getElementById( FORM_ID ),
    window.$data.formSelect
)

/* 初始化表单数据 */
window.$form.initFormData(
    document.getElementById( FORM_ID ),
    window.$data.formData
)

/* 绑定表单事件 */
window.$form.bindFormEvent(
    document.getElementById( FORM_ID ),
    FORM_INPUT_EL_EVENT,
    USER_EVENT
)

/* 初始化Tips */
window.$form.initSelectTips(
    document.getElementById( OPRTIPS_ID ),
    window.$data.formData,
    window.$data.tipsData
)


// 实例化draw
let draw = new DrawSVG(
    document.getElementById( SVG_CANVAS_ID ),
    {
        type: window.$data.formData.inputSVGGraphType.value,
        fill: window.$data.formData.inputFill.value,
        strokeColor: window.$data.formData.inputStrokeColor.value,
        strokeWidth: window.$data.formData.inputStrokeWidth.value,
        strokeOpacity: window.$data.formData.inputStrokeOpacity.value
    }
)

// 初始化
// 用于执行绑定事件
draw.init()


/* 监听表单派发事件 */
document.addEventListener(USER_EVENT, function( params ){
    let detail = params.detail
    
    switch( String( detail.key ) ){
        case 'inputStrokeColor':
                draw.modifyStrokeColor( detail.value )
            break;

        case 'inputStrokeWidth':
                draw.modifyStrokeWidth( detail.value )
            break;

        case 'inputStrokeOpacity':
                draw.modifyStrokeOpacity( detail.value )
            break;

        case 'inputFill':
                draw.modifyFill( detail.value )
            break;

        case 'inputSVGGraphType':
                draw.modifyGeometryType( detail.value )
                /* 渲染提示语句 */
                window.$util.renderOprTips(
                    document.getElementById( OPRTIPS_ID ),
                    window.$data.tipsData[detail.key][detail.value] || ''
                )
            break;

        default:;
    }    
})


/* 辅助功能 */
/* 清空画板 */
document.getElementById( 'clearBtn' ).addEventListener('click', function( evte ){
    evte.preventDefault()
    document.getElementById( SVG_CANVAS_ID ).innerHTML = ''
}, false)
