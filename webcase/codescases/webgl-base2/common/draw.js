function baseDraw(points, ctx, optional = {}) {
    const defaultStrokeStyle = 'black'
    const defaultFillStyle = null
    const defaultIsClose = false
    /* ... */
    const strokeStyle = optional.strokeStyle || defaultStrokeStyle
    const isClosePath = optional.strokeStyle || defaultIsClose
    const fillStyle = optional.fillStyle || defaultFillStyle
    /* ... */
    ctx.strokeStyle = strokeStyle
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for(let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
    }
    if (isClosePath) {
        ctx.closePath()
    }
    if (fillStyle) {
        ctx.fillStyle = fillStyle
        ctx.fill()
    }
    ctx.stroke()
}

function drawArc(centerX, centerY, radius, startRad = 0, endRad = 2 * Math.PI) {
    const generator = parametric(
        (cita) => {
            return centerX + radius * Math.cos(cita)
        },
        (cita) => {
            return centerY + radius * Math.sin(cita)
        }
    )    
    return {
        render(ctx, optional = {}) {
            generator(startRad, endRad).render(baseDraw, ctx, optional)
        }
    }
}

function drawEllipse(centerX, centerY, aAxle, bAxle, startRad = 0, endRad = 2 * Math.PI) {
    const generator = parametric(
        (cita) => {
            return centerX + aAxle * Math.cos(cita)
        },
        (cita) => {
            return centerY + bAxle * Math.sin(cita)
        }
    )    
    return {
        render(ctx, optional = {}) {
            generator(startRad, endRad).render(baseDraw, ctx, optional)
        }
    }
}

function drawPara(p, startRad = 0, endRad = 2 * Math.PI) {
    const generator = parametric(
        (cita) => {
            return p * cita
        },
        (cita) => {
            return p * cita ** 2
        }
    ) 
    return {
        render(ctx, optional = {}) {
            generator(startRad, endRad).render(baseDraw, ctx, optional)
        }
    } 
}
