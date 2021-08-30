/*
    svg.js
 */ 
window.$svg = {
    /**
     * @method createSVGElement
     * @desc 创建SVG元素
     * @param {String} svgNS SVG格式
     * @param {String} geometryType SVG元素类型
     * @return {DOM}
     */
    createSVGElement(
        svgNS,
        geometryType
    ){
        return document.createElementNS(svgNS, geometryType)
    },
    /**
     * @method appendSVGElement
     * @desc 追加SVG元素
     * @param {Element} element 子节点
     * @param {Element} canvasDom 父节点
     * @return {Undefined}
     */
    appendSVGElement(
        svgElement,
        canvasDom
    ){
        canvasDom.appendChild( svgElement )
    },
    /**
     * @method setStroke
     * @desc 设置SVG元素的描边样式
     * @param {Element} svgElement SVG节点
     * @param {Object} options 描边参数项
     * @return {Undefined}
     */
    setStroke(
        svgElement,
        options = {}
    ){
        Object.keys( options ).forEach((item, index)=>{
            this.setStrokeItem(
                svgElement,
                item,
                options[item]
            )
        }) 
    },
    setStrokeItem(
        svgElement,
        type,
        value
    ){
        switch( String( type ) ){
            case 'strokeColor':
                    svgElement.setAttribute('stroke', value)
                break
    
            case 'strokeWidth':
                    svgElement.setAttribute('stroke-width', value)
                break
    
            case 'strokeOpacity':
                    svgElement.setAttribute('stroke-opacity', value)
                break
    
            default:;
        }
    },
    /**
     * @method setFill
     * @desc 设置SVG元素的填充样式
     * @param {Element} svgElement SVG节点
     * @param {String} fill 填充样式
     * @return {Undefined}
     */
    setFill(
        svgElement,
        fill
    ){
        svgElement.setAttribute('fill', fill)
    },
    /**
     * @method getSVGElementAttr
     * @desc 获取SVG元素节点属性
     * @param {Element} svgElement SVG节点
     * @param {String} attr 属性
     * @return {Undefined}
     */
    getSVGElementAttr(
        svgElement,
        attr
    ){
        return svgElement.getAttribute( attr ) || ''
    },
    /**
     * @method setEllipseCenterPosition
     * @desc 获取SVG椭圆元素圆心坐标
     * @param {Element} svgElement SVG节点
     * @param {String} axial 轴向
     * @param {Number} value 参数值
     * @return {Undefined}
     */
    setEllipseCenterPosition(
        svgElement, 
        axial,
        value = 0
    ){
        if( axial === 'x' ){
            svgElement.setAttribute('cx', value)
        }
        if( axial === 'y' ){
            svgElement.setAttribute('cy', value)
        }
    },
    /**
     * @method setEllipseRadius
     * @desc 获取SVG椭圆元素轴半径
     * @param {Element} svgElement SVG节点
     * @param {String} axial 轴向
     * @param {Number} value 参数值
     * @return {Undefined}
     */
    setEllipseRadius(
        svgElement, 
        axial,
        value = 0
    ){
        if( axial === 'x' ){
            svgElement.setAttribute('rx', value)
        }
        if( axial === 'y' ){
            svgElement.setAttribute('ry', value)
        }
    },
    /**
     * @method setRectStartPosition
     * @desc 获取SVG矩形元起始坐标
     * @param {Element} svgElement SVG节点
     * @param {String} axial 轴向
     * @param {Number} value 参数值
     * @return {Undefined}
     */
    setRectStartPosition(
        svgElement, 
        axial,
        value = 0
    ){
        if( axial === 'x' ){
            svgElement.setAttribute('x', value)
        }
        if( axial === 'y' ){
            svgElement.setAttribute('y', value)
        }
    },
    /**
     * @method setRectStartPosition
     * @desc 获取SVG矩形轴投影长度
     * @param {Element} svgElement SVG节点
     * @param {String} axial 轴向
     * @param {Number} value 参数值
     * @return {Undefined}
     */
    setRectLength(
        svgElement, 
        axial,
        value = 0
    ){
        if( axial === 'x' ){
            svgElement.setAttribute('width', value)
        }
        if( axial === 'y' ){
            svgElement.setAttribute('height', value)
        }
    },
    /**
     * @method setPolygonPointsList
     * @desc 获取SVG多边形顶点坐标列表
     * @param {Element} svgElement SVG节点
     * @param {Array} points 顶点坐标列表
     * @return {Undefined}
     */
    setPolygonPointsList(
        svgElement, 
        points = []
    ){
        let string = ''
    
        points.forEach((item, index)=>{
            string += `${item.x},${item.y} `
        })
    
        svgElement.setAttribute('points', string)
    },
    /**
     * @method setPolylinePointsList
     * @desc 获取SVG折线端点坐标列表
     * @param {Element} svgElement SVG节点
     * @param {Array} points 端点坐标列表
     * @return {Undefined}
     */
    setPolylinePointsList(
        svgElement, 
        points = []
    ){
        let string = ''
    
        points.forEach((item, index)=>{
            string += `${item.x},${item.y} `
        })
    
        svgElement.setAttribute('points', string)
    },
    /**
     * @method setPath3PointsList
     * @desc 获取SVG 3次贝塞尔曲线坐标列表
     * @param {Element} svgElement SVG节点
     * @param {Array} points 坐标列表
     * @return {Undefined}
     */
    setPath3PointsList(
        svgElement, 
        points = []
    ){
        let string = ''
        // 拷贝一份副本
        let array = points.slice( 0 )
        // 截取前面4项
        let arr1 = array.splice(0, 4)
        // 将剩余的部分等分，每份3项
        let arr2 = window.$util.groupArray(array, 3)

        string += this.getDValue(arr1, 0)
        arr2.forEach((item, index)=>{
            string += this.getDValue(item, index + 1)
        })
        // 过滤
        string = string.replace(/[\r\n]/g, "").replace(/\s+/g, " ").trim()
        
        // 写入属性
        svgElement.setAttribute('d', string)
    },
    getDValue(
        points = [],
        sIndex = 0
    ){
        let string = ''
        if( points.length === 1 ){
            string += 
                sIndex <= 0 ? 
                `
                    M${points[0].x} ${points[0].y} 
                ` : 
                `
                    ${points[0].x} ${points[0].y} 
                    ${points[0].x} ${points[0].y}
                    ${points[0].x} ${points[0].y} 
                `
        }
        if( points.length === 2 ){
            string += 
                sIndex <= 0 ? 
                `
                    M${points[0].x} ${points[0].y} 
                    ${points[1].x} ${points[1].y} 
                ` : 
                `
                    ${points[0].x} ${points[0].y}
                    ${points[0].x} ${points[0].y} 
                    ${points[1].x} ${points[1].y} 
                `
        }
        if( points.length === 3 ){
            string += 
                sIndex <= 0 ? 
                `
                    M${points[0].x} ${points[0].y} 
                    C${points[1].x} ${points[1].y} ${points[1].x} ${points[1].y}
                    ${points[2].x} ${points[2].y} 
                ` : 
                `
                    ${points[0].x} ${points[0].y}
                    ${points[1].x} ${points[1].y} 
                    ${points[2].x} ${points[2].y}
                `
        }
        if( points.length === 4 ){
            string += `
                M${points[0].x} ${points[0].y} 
                C${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y}
                ${points[3].x} ${points[3].y} 
            `
        }

        return string
    }
}
