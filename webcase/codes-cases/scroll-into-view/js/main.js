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
        containerElement.scrollTop = scrollToShowInViewTop
        return
    }
    /*
        当目标元素隐藏于视口下方时, 满足此条件
        此时需要将该元素滚动到视口底部 
     */
    if (containerElement.scrollTop < scrollToShowInViewBottom) {
        containerElement.scrollTop = scrollToShowInViewBottom
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