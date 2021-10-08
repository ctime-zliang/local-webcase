/*
    data.js
 */

window.$data = {
    formData: {
        inputStrokeColor: {
            value: '#ff6600',
            _readonly: false,
            _eventName: 'inputStrokeColor'
        },
        inputStrokeWidth: {
            value: '2',
            _readonly: false,
            _eventName: 'inputStrokeWidth'
        },
        inputStrokeOpacity: {
            value: '1',
            _readonly: false,
            _eventName: 'inputStrokeOpacity'
        },
        inputFill: {
            value: 'transparent',
            _readonly: true,
            _eventName: 'inputFill'
        },
        inputSVGGraphType: {
            value: 'rect',
            _readonly: false,
            _eventName: 'inputSVGGraphType'
        }
    },
    formSelect: {
        inputSVGGraphType: {
            'rect': {
                label: '矩形(rect)'
            },
            'ellipse': {
                label: '椭圆(ellipse)'
            },
            'polygon': {
                label: '多边形(polygon)'
            },
            'polyline': {
                label: '折线(polyline)'
            },
            'path': {
                label: '三次贝塞尔曲线(path)'
            }
        }  
    },
    tipsData: {
        inputSVGGraphType: {
            'rect': '按下左键不松开拖拽绘制图形，松开左键即退出编辑',
            'ellipse': '按下左键不松开拖拽绘制图形，松开左键即退出编辑',
            'polygon': '每点击一次左键即确认一个多边形的位置点，点击右键即可退出编辑，同时点击右键时鼠标所处的位置将作为该多边形的一个有效位置点',
            'polyline': '每点击一次左键即确认一个折线的位置点，点击右键即可退出编辑，同时点击右键时鼠标所处的位置将作为该折线的最后一个有效位置点',
            'path': '每点击一次左键即确认一个位置点，点击右键即可退出编辑，同时点击右键时鼠标所处的位置将作为该曲线的最后一个有效位置点'
        }
    }
}