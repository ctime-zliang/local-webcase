const ven$jsonDiff = {
    VALUE_CREATED: 'created',
    VALUE_UPDATED: 'updated',
    VALUE_DELETED: 'deleted',
    VALUE_UNCHANGED: 'unchanged',
    map(obj1, obj2) {
        let diff = {}
        let key
        let valueOfObj2
        if (this.isFunction(obj1) || this.isFunction(obj2)) {
            throw 'Invalid argument. Function given, Object expected.'
        }
        if (this.isValue(obj1) || this.isValue(obj2)) {
            return {
                type: this.compareValues(obj1, obj2),
                data: ( obj1 === undefined ) ? obj2 : obj1
            }
        }
        for (key in obj1) {
            if (this.isFunction(obj1[key])) {
                continue
            }                
            valueOfObj2 = undefined;
            if ('undefined' !== typeof obj2[key]) {
                valueOfObj2 = obj2[key]
            }                
            diff[key] = this.map(obj1[key], valueOfObj2)
        }
        for (key in obj2) {
            if (this.isFunction(obj2[key]) || 'undefined' != typeof diff[key]) {
                continue
            }                
            diff[key] = this.map(undefined, obj2[key])
        }            
        return diff
    },
    compareValues(value1, value2) {
        if (value1 === value2) {
            return this.VALUE_UNCHANGED
        }
        if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
            return this.VALUE_UNCHANGED
        }
        if ('undefined' == typeof(value1)) {
            return this.VALUE_CREATED
        }
        if ('undefined' == typeof(value2)) {
            return this.VALUE_DELETED
        }            
        return this.VALUE_UPDATED
    },
    isFunction(obj) {
        return {}.toString.apply(obj) === '[object Function]'
    },
    isArray(obj) {
        return {}.toString.apply(obj) === '[object Array]'
    },
    isObject(obj) {
        return {}.toString.apply(obj) === '[object Object]'
    },
    isDate(obj) {
        return {}.toString.apply(obj) === '[object Date]'
    },
    isValue(obj) {
        return !this.isObject(obj) && !this.isArray(obj)
    }
}