const utils = {
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

const formControl = {
    container: null,
    inputElements: [],
    changeCallback: null,
    init() {
        this.inputElements = [
            ...Array.from(this.container.querySelectorAll('[data-forminput]'))
        ]
        this.bindEvent()
    }, 
    bindEvent() {
        const extendTagElements = this.container.querySelectorAll('[data-tagitem-geometry-setting]')
        for (let i = 0; i < this.inputElements.length; i++) {
            const element = this.inputElements[i]
            element.addEventListener('input', (evte) => {
                switch (evte.currentTarget.getAttribute('data-forminput')) {
                    case 'geometryType': {
                        Array.from(extendTagElements).forEach(el => {
                            if (el.getAttribute('data-tagitem-geometry-setting') === evte.currentTarget.value) {
                                el.style.display = 'block'
                            } else {
                                el.style.display = 'none'
                            }
                        })
                        break
                    }
                    default:;
                }
                const data = {}
                this.inputElements.forEach(item => {
                    const forminputAttr = item.getAttribute('data-forminput')
                    const namespaceAttr = item.getAttribute('data-namespace')
                    let value = undefined
                    if (item.type === 'radio') {
                        value = item.checked ? item.value : undefined
                    } else if (item.type === 'checkbox') {
                        value = item.checked ? true : false
                    } else {
                        value = item.value
                    }
                    if (!data[namespaceAttr]) {
                        data[namespaceAttr] = {}
                    }
                    if (['control'].includes(namespaceAttr) && typeof value !== 'undefined') {
                        data[namespaceAttr][forminputAttr] = value
                        return
                    }
                    if (typeof value !== 'undefined') {
                        const settingAttr = item.parentElement.parentElement.parentElement.parentElement.getAttribute('data-tagitem-geometry-setting')
                        if (!data[namespaceAttr][settingAttr]) {
                            data[namespaceAttr][settingAttr] = {}
                        }
                        if (typeof value !== 'undefined') {
                            data[namespaceAttr][settingAttr][forminputAttr] = value
                        }
                        return
                        
                    }
                })
                this.changeCallback && this.changeCallback(data)
            }, false)
        }
    }
}