/*
    draw.js
 */
/************************************ 基础配置项 ************************************/ 
const DEFAULT_PROFILE = {
    SVG_NS: 'http://www.w3.org/2000/svg',
    XLINK_NS: 'http://www.w3.org/1999/xlink'
}
const DEFAULT_TYPE_ARR = [
    'rect', 
    'ellipse', 
    'polygon', 
    'polyline', 
    'path'
]
const MUL_CLICK_TYPE = [
    'polygon', 
    'polyline', 
    'path'
]
const DEFAULT_OPTIONS = {
    geometryType: 'rect',
    fill: 'transparent',
    strokeColor: '#ff6600',
    strokeWidth: '2',
    strokeOpacity: '1'
}





/************************************ 类定义 ************************************/ 
function DrawSVG(
    canvasDom,
    options = {}
){    
    if( 
        !canvasDom || canvasDom.nodeType !== 1
        || Object.prototype.toString.call( options ).slice(8, -1).toLowerCase() !== 'object'
    ){
        throw new Error( 'Illegal parameter.' )
    }
    
    // 初始化属性
    this.PosRect = {}
    this.cnsRect = {}
    this.options = window.$util.mergeOptions(DEFAULT_OPTIONS, options)
    // 修改 几何类型 参数项
    this.modifyGeometryType( options.type )
    // 标记属性
    this.hasBindMousemoveEvent = false

    // DOM句柄
    this.canvasDom = canvasDom
    this.targetDom = null 

    // 修改this指向并返回一个新的事件句柄函数
    this.handlerMousedown = handlerMousedown.bind( this )
    this.handlerMousemove = handlerMousemove.bind( this )
    this.handlerMouseup = handlerMouseup.bind( this )
    this.handlerContextMenu = handlerContextMenu.bind( this )
}

/************************************ 类 原型方法 ************************************/ 
DrawSVG.prototype.init = function(){
    this.canvasDom.addEventListener(
        'mousedown', 
        this.handlerMousedown, 
        false
    )    
    this.canvasDom.addEventListener(
        'mouseup', 
        this.handlerMouseup, 
        false
    )
    document.addEventListener(
        'contextmenu', 
        this.handlerContextMenu, 
        false
    )
}
/* 修改几何类型 */
DrawSVG.prototype.modifyGeometryType = function( 
    geometryType
){
    this.options.geometryType = DEFAULT_TYPE_ARR.indexOf( geometryType ) <= -1 ? DEFAULT_TYPE_ARR[0] : geometryType
}
/* 修改填充样式 */
DrawSVG.prototype.modifyFill = function( 
    fill
){
    this.options.fill = String( fill ) || DEFAULT_OPTIONS.fill
}
/* 修改描边颜色 */
DrawSVG.prototype.modifyStrokeColor = function( 
    strokeColor
){
    this.options.strokeColor = String( strokeColor ) || DEFAULT_OPTIONS.strokeColor
}
/* 修改描边宽度 */
DrawSVG.prototype.modifyStrokeWidth = function( 
    strokeWidth
){
    this.options.strokeWidth = String( strokeWidth ) || DEFAULT_OPTIONS.strokeWidth
}
/* 修改描边透明度 */
DrawSVG.prototype.modifyStrokeOpacity = function( 
    strokeOpacity
){
    this.options.strokeOpacity = String( strokeOpacity ) || DEFAULT_OPTIONS.strokeOpacity
}





/************************************ 鼠标事件方法 ************************************/ 
function handlerMousedown(
    evte
){
    evte.preventDefault()
    evte.stopPropagation()

    let shouldCreateElement = false
    /* 仅左键有效 */
    if( evte.which !== 1 ){
        return
    }
    // 新建元素
    if( !this.targetDom ){
        this.targetDom = window.$svg.createSVGElement(DEFAULT_PROFILE.SVG_NS, this.options.geometryType)
        shouldCreateElement = true
    }
    // 添加points记录点数组
    if( !this.targetDom.pointsList ){
        this.targetDom.pointsList = []
    }     

    // 获取画布容器的尺寸及位置参数
    this.cnsRect = window.$util.getBoundingClientRect( this.canvasDom )
    // 获取点击点相对于画布容器的X/Y坐标
    this.PosRect.mouseDownClientX = +evte.clientX - this.cnsRect.left
    this.PosRect.mouseDownClientY = +evte.clientY - this.cnsRect.top
    
    // 设置描边样式
    window.$svg.setStroke(
        this.targetDom,
        {
            strokeColor: this.options.strokeColor,
            strokeWidth: this.options.strokeWidth,
            strokeOpacity: this.options.strokeOpacity
        }
    )
    // 设置填充样式  
    window.$svg.setFill(this.targetDom, this.options.fill)      

    switch( String( this.options.geometryType ) ){
        case 'rect':
                /* 设置矩形的起始坐标 */
                window.$svg.setRectStartPosition(
                    this.targetDom,
                    'x',
                    this.PosRect.mouseDownClientX
                )
                window.$svg.setRectStartPosition(
                    this.targetDom,
                    'y',
                    this.PosRect.mouseDownClientY
                )
            break;

        case 'ellipse':
                /* 设置椭圆的圆心坐标 */
                window.$svg.setEllipseCenterPosition(
                    this.targetDom,
                    'x',
                    this.PosRect.mouseDownClientX
                )
                window.$svg.setEllipseCenterPosition(
                    this.targetDom,
                    'y',
                    this.PosRect.mouseDownClientY
                )
            break;

        case 'polygon':  
                /* 设置多边形的顶点坐标 */                             
                this.targetDom.pointsList.push({
                    x: this.PosRect.mouseDownClientX,
                    y: this.PosRect.mouseDownClientY
                })
                window.$svg.setPolygonPointsList(
                    this.targetDom,
                    this.targetDom.pointsList
                )             
            break;

        case 'polyline':       
                /* 设置折线的端点坐标 */
                this.targetDom.pointsList.push({
                    x: this.PosRect.mouseDownClientX,
                    y: this.PosRect.mouseDownClientY
                })
                window.$svg.setPolylinePointsList(
                    this.targetDom,
                    this.targetDom.pointsList
                )
            break;

        case 'path':    
                /* 设置路径端点坐标及控制点坐标 */
                this.targetDom.pointsList.push({
                    x: this.PosRect.mouseDownClientX,
                    y: this.PosRect.mouseDownClientY
                })
                window.$svg.setPath3PointsList(
                    this.targetDom,
                    this.targetDom.pointsList
                )
            break;

        default: return;
    }

    // 添加元素
    shouldCreateElement && window.$svg.appendSVGElement(this.targetDom, this.canvasDom)

    // 防止重复绑定
    if( !this.hasBindMousemoveEvent ){  
        this.hasBindMousemoveEvent = true      
        document.addEventListener(
            'mousemove', 
            this.handlerMousemove, 
            false
        ) 
    } 
}
function handlerMousemove(
    evte
){    
    evte.preventDefault()
    evte.stopPropagation()

    let pointsList = []

    // 获取鼠标当前位置点相对于画布容器的X/Y坐标
    this.PosRect.mouseMoveClientX = +evte.clientX - this.cnsRect.left
    this.PosRect.mouseMoveClientY = +evte.clientY - this.cnsRect.top

    // 构造动态坐标点数据
    pointsList = [].concat(this.targetDom.pointsList, [{x: this.PosRect.mouseMoveClientX, y: this.PosRect.mouseMoveClientY}])

    switch( String( this.options.geometryType ) ){
        case 'rect':
                let xPos = 0
                let yPox = 0

                /* 设置矩形的X轴起始坐标 & X轴投影长度 */
                xPos = this.PosRect.mouseMoveClientX < this.PosRect.mouseDownClientX ? this.PosRect.mouseMoveClientX : this.PosRect.mouseDownClientX
                window.$svg.setRectStartPosition(
                    this.targetDom,
                    'x',
                    xPos
                )
                window.$svg.setRectLength(
                    this.targetDom,
                    'x',
                    Math.abs( this.PosRect.mouseMoveClientX - this.PosRect.mouseDownClientX )
                )
                    
                /* 设置矩形的Y轴起始坐标 & Y轴投影长度 */
                yPox = this.PosRect.mouseMoveClientY < this.PosRect.mouseDownClientY ? this.PosRect.mouseMoveClientY : this.PosRect.mouseDownClientY
                window.$svg.setRectStartPosition(
                    this.targetDom,
                    'y',
                    yPox
                ) 
                window.$svg.setRectLength(
                    this.targetDom,
                    'y',
                    Math.abs( this.PosRect.mouseMoveClientY - this.PosRect.mouseDownClientY )
                ) 
            break;

        case 'ellipse':
                let coefficientX = 1
                let coefficientY = 1

                /* 设置椭圆的X轴圆心坐标 & X轴半径长度 */
                coefficientX = this.PosRect.mouseMoveClientX < this.PosRect.mouseDownClientX ? -1 : 1
                window.$svg.setEllipseCenterPosition(
                    this.targetDom,
                    'x',
                    this.PosRect.mouseDownClientX + coefficientX * Math.abs( this.PosRect.mouseMoveClientX - this.PosRect.mouseDownClientX ) / 2
                )  
                window.$svg.setEllipseRadius(
                    this.targetDom,
                    'x',
                    Math.abs( this.PosRect.mouseMoveClientX - this.PosRect.mouseDownClientX ) / 2
                )

                /* 设置椭圆的Y轴圆心坐标 & Y轴半径长度 */
                coefficientY = this.PosRect.mouseMoveClientY < this.PosRect.mouseDownClientY ? -1 : 1
                window.$svg.setEllipseCenterPosition(
                    this.targetDom,
                    'y',
                    this.PosRect.mouseDownClientY + coefficientY * Math.abs( this.PosRect.mouseMoveClientY - this.PosRect.mouseDownClientY ) / 2
                ) 
                window.$svg.setEllipseRadius(
                    this.targetDom,
                    'y',
                    Math.abs( this.PosRect.mouseMoveClientY - this.PosRect.mouseDownClientY ) / 2
                )
            break;

        case 'polygon':
                /* 设置实时的多边形的顶点坐标 */      
                window.$svg.setPolygonPointsList(
                    this.targetDom,
                    pointsList
                )
            break;

        case 'polyline':
                /* 设置实时的折线的端点坐标 */      
                window.$svg.setPolylinePointsList(
                    this.targetDom,
                    pointsList
                )
            break;

        case 'path':
                /* 设置路径实时的端点坐标及控制点坐标 */
                window.$svg.setPath3PointsList(
                    this.targetDom,
                    pointsList
                )
            break;

        default: return;
    }
}
function handlerMouseup(
    evte
){    
    evte.preventDefault()
    evte.stopPropagation()      

    /* 
        拖拽绘制的几何类型
        在左键抬起时移除move事件
     */
    if( MUL_CLICK_TYPE.indexOf( this.options.geometryType ) <= -1 ){        
        document.removeEventListener(
            'mousemove', 
            this.handlerMousemove, 
            false
        )
        this.targetDom = null
        this.PosRect = {} 
        this.hasBindMousemoveEvent = false  
    }    
}
function handlerContextMenu(
    evte
){    
    evte.preventDefault()
    evte.stopPropagation()

    document.removeEventListener(
        'mousemove', 
        this.handlerMousemove, 
        false
    )
    this.targetDom = null
    this.PosRect = {}  
    this.hasBindMousemoveEvent = false   
}


