function FormControl(container) {
    this.container = container
    this.inputElements = []
    this.events = {}
    this.formData = null
    this._init()
}
FormControl.prototype._init = function() {
    this.inputElements = Array.from(this.container.querySelectorAll('[data-forminput-name]'))
    this._bindEvent()
}
FormControl.prototype.on = function(name, callback) {
    if (typeof name !== 'string' || !name || typeof callback !== 'function') {
        return
    }
    if (!this.events[name]) {
        this.events[name] = []
    }
    this.events[name].push(callback)
}
FormControl.prototype.setData = function(data) {
    this.formData = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < this.inputElements.length; i++) {
        const element = this.inputElements[i]
        const attr = element.getAttribute('data-forminput-name')
        if (typeof data[attr] === 'undefined') {
            continue
        }
        switch(element.type) {
            case undefined:
            case 'file':
            case 'submit':
            case 'reset':
            case 'button':
                break;
            case 'select-one': {
                    let isSetSelecte = false
                    const children = Array.from(element.children)
                    for (let j = 0; j < children.length; j++) {
                        if ((children[j].value || children[j].getAttribute('value')) === data[attr]) {
                            children[j].setAttribute('selected', 'selected')
                            children[j].selected = true
                            isSetSelecte = true
                        } else {
                            children[j].removeAttribute('selected')
                            children[j].selected = false
                        }
                    }
                    if (isSetSelecte) {
                        element.value = data[attr]
                    }
                break
            }
            case 'radio': {
                const radioElements = this.container.querySelectorAll(`[name="${element.getAttribute('name')}"]`)
                if (!radioElements || !radioElements.length) {
                    break
                }
                for (let j = 0; j < radioElements.length; j++) {
                    if (radioElements[j].value === data[attr]) {
                        radioElements[j].setAttribute('checked', 'checked')
                        radioElements[j].checked = true
                    } else {
                        radioElements[j].removeAttribute('checked')
                        radioElements[j].checked = false
                    }
                }
                break
            }
            case 'checkbox': {
                const checkboxElements = this.container.querySelectorAll(`[name="${element.getAttribute('name')}"]`)
                if (!checkboxElements || !checkboxElements.length || !(data[attr] instanceof Array)) {
                    break
                }
                for (let j = 0; j < checkboxElements.length; j++) {
                    if (data[attr].includes(checkboxElements[j].value)) {
                        radioElements[j].setAttribute('checked', 'checked')
                        radioElements[j].checked = true
                    } else {
                        radioElements[j].removeAttribute('checked')
                        radioElements[j].checked = false
                    }
                }
            }
            default: {
                element.value = data[attr]
            }
        }
    }
}
FormControl.prototype._bindEvent = function() {
    for (let i = 0; i < this.inputElements.length; i++) {
        const element = this.inputElements[i]
        element.addEventListener('change', (evte) => {
            const attr = evte.currentTarget.getAttribute('data-forminput-name')
            if (typeof this.formData[attr] !== 'undefined') {
                this.formData[attr] = evte.currentTarget.value || evte.currentTarget.getAttribute('value')
            }
            this._emit('change', attr, this.formData[attr], this.formData)
        }, false)
    }
}
FormControl.prototype._emit = function(name) {
    if (!arguments.length || typeof name !== 'string' || !this.events[name]) {
        return
    }
    const params = Array.from(arguments).splice(1)
    this.events[name].forEach((item, index) => {
        item(...params)
    })
}