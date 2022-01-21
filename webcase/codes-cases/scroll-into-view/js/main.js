const Animate = {
    cache: {},
    timer: null,
    run(json, runningCallback, finishedCallback) {
        clearInterval(this.timer)
        const jsonKeys = Object.keys(json)
        let flag = true
        let sp = 0.01
        let rate = 0.5
        this.timer = window.setInterval(() => {
            flag = true
            for (let i = 0; i < jsonKeys.length; i++) {
                const targetData = json[jsonKeys[i]]
                let icur = parseFloat(this.cache[jsonKeys[i]] || 0)
                let speed = (+targetData - icur) * sp
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
                if (icur != targetData) {
                    flag = false
                } 
                this.cache[jsonKeys[i]] = icur + speed * rate
                runningCallback && runningCallback(jsonKeys[i], this.cache[jsonKeys[i]])                
            }
            if(flag){
                window.clearInterval(this.timer)
                finishedCallback && finishedCallback(this.cache)
            }
        })
    }
}

function scrollIntoViewByIndex(itemIndex, containerElement) {
    const containerElementRect = containerElement.getBoundingClientRect().toJSON()
    const targetElemet = containerElement.children[itemIndex]
    if (!targetElemet) {
        return
    }
    const targetElemetRect = targetElemet.getBoundingClientRect().toJSON()
    /*
        将元素滚动到视口最顶部时需要给视口设定的 scroll-top 的值 
     */
    const scrollToShowInViewTop = targetElemet.offsetTop
    /* 
        将元素滚动到视口最底部时需要给视口设定的 scroll-top 的值
     */
    const scrollToShowInViewBottom = (targetElemet.offsetTop + targetElemetRect.height) - containerElementRect.height
    /*
        当目标元素隐藏于视口上方时, 满足此条件
        此时需要将该元素滚动到视口顶部
     */
    if (containerElement.scrollTop > scrollToShowInViewTop) {
        // containerElement.scrollTop = scrollToShowInViewTop
        Animate.run({ scrollTop: scrollToShowInViewTop },  (key, value) => {
            containerElement.scrollTop = value
        }, () => {
            console.log('finished.')
        })
        return
    }
    /*
        当目标元素隐藏于视口下方时, 满足此条件
        此时需要将该元素滚动到视口底部 
     */
    if (containerElement.scrollTop < scrollToShowInViewBottom) {
        // containerElement.scrollTop = scrollToShowInViewBottom
        Animate.run({ scrollTop: scrollToShowInViewBottom },  (key, value) => {
            containerElement.scrollTop = value
        }, () => {
            console.log('finished.')
        })
        return
    }
}

function getItemPostionByTarget(targetElemet, containerElement) {
    if (!targetElemet) {
        return ''
    }
    const containerElementRect = containerElement.getBoundingClientRect().toJSON()
    const targetElemetRect = targetElemet.getBoundingClientRect().toJSON()
    if (containerElement.scrollTop > targetElemet.offsetTop + targetElemetRect.height / 2) {
        return `Hidden in Up`
    }
    if (containerElement.scrollTop + containerElementRect.height < targetElemet.offsetTop + targetElemetRect.height / 2) {
        return `Hidden in Bottom`
    }   
    return `Show in View`
}