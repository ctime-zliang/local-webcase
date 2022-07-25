class Ven$JsonDiff {
    static CHANGE_TYPE = {
        VALUE_CREATED: 'created',
        VALUE_UPDATED: 'updated',
        VALUE_DELETED: 'deleted',
        VALUE_UNCHANGED: 'unchanged',
    }

    static diff(obj1, obj2) {
        let diff = {}
        let key
        let valueOfObj2
        if (this._isFunction(obj1) || this._isFunction(obj2)) {
            throw 'Invalid argument. Function given, Object expected.'
        }
        if (this._isValue(obj1) || this._isValue(obj2)) {
            return {
                type: this._compareValues(obj1, obj2),
                data: obj1 === undefined ? obj2 : obj1
            }
        }
        for (key in obj1) {
            if (this._isFunction(obj1[key])) {
                continue
            }                
            valueOfObj2 = undefined
            if ('undefined' !== typeof obj2[key]) {
                valueOfObj2 = obj2[key]
            }                
            diff[key] = this.diff(obj1[key], valueOfObj2)
        }
        for (key in obj2) {
            if (this._isFunction(obj2[key]) || 'undefined' != typeof diff[key]) {
                continue
            }                
            diff[key] = this.diff(undefined, obj2[key])
        }            
        return diff
    }

    static _compareValues(value1, value2) {
        if (value1 === value2) {
            return this.VALUE_UNCHANGED
        }
        if (this._isDate(value1) && this._isDate(value2) && value1.getTime() === value2.getTime()) {
            return this.CHANGE_TYPE.VALUE_UNCHANGED
        }
        if ('undefined' == typeof(value1)) {
            return this.CHANGE_TYPE.VALUE_CREATED
        }
        if ('undefined' == typeof(value2)) {
            return this.CHANGE_TYPE.VALUE_DELETED
        }            
        return this.CHANGE_TYPE.VALUE_UPDATED
    }

    static _isFunction(obj) {
        return {}.toString.apply(obj) === '[object Function]'
    }

    static _isArray(obj) {
        return {}.toString.apply(obj) === '[object Array]'
    }

    static _isObject(obj) {
        return {}.toString.apply(obj) === '[object Object]'
    }

    static _isDate(obj) {
        return {}.toString.apply(obj) === '[object Date]'
    }

    static _isValue(obj) {
        return !this._isObject(obj) && !this._isArray(obj)
    }
}
