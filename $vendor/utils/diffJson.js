class Ven$JsonDiff {
	static TYPE_CREATED = 'CREATED'
	static TYPE_UPDATED = 'UPDATED'
	static TYPE_DELETED = 'DELETED'
	static TYPE_UNCHANGED = 'UNCHANGED'

	static isFunction(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'function'
	}

	static isArray(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'array'
	}

	static isObject(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'object'
	}

	static isDate(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'date'
	}

	static isUndefined(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'undefined'
	}

	static isNull(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'null'
	}

	static isRegexp(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'regexp'
	}

	static isError(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'error'
	}

	static isMap(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'map'
	}

	static isWeakMap(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'weakmap'
	}

	static isSet(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'set'
	}

	static isWeakSet(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'weakset'
	}

	static isSymbol(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'symbol'
	}

	static isBigInt(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase() === 'bigint'
	}

	static isPrimitiveValue(target) {
		return !this.isObject(target) && !this.isArray(target)
	}

	static compareValues(value1, value2) {
		if (value1 === value2) {
			return this.TYPE_UNCHANGED
		}
		if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
			return this.TYPE_UNCHANGED
		}
		if ('undefined' == typeof value1) {
			return this.TYPE_CREATED
		}
		if ('undefined' == typeof value2) {
			return this.TYPE_DELETED
		}
		return this.TYPE_UPDATED
	}

	/**
	 * @description exec 主函数
	 * @function exec
	 * @param {object|array} obj1 对象 1
	 * @param {object|array} obj2 对象 2
	 * @return {object}
	 */
	static exec(obj1, obj2) {
		const result = {}
		let valueOfObj2
		if (this.isFunction(obj1) || this.isFunction(obj2)) {
			throw 'Invalid argument. Function given, Object expected.'
		}
		if (this.isPrimitiveValue(obj1) || this.isPrimitiveValue(obj2)) {
			return {
				type: this.compareValues(obj1, obj2),
				data: obj1 === undefined ? obj2 : obj1,
			}
		}
		for (let key in obj1) {
			if (this.isFunction(obj1[key])) {
				continue
			}
			valueOfObj2 = undefined
			if ('undefined' !== typeof obj2[key]) {
				valueOfObj2 = obj2[key]
			}
			result[key] = this.exec(obj1[key], valueOfObj2)
		}
		for (let key in obj2) {
			if (this.isFunction(obj2[key]) || 'undefined' != typeof result[key]) {
				continue
			}
			result[key] = this.exec(undefined, obj2[key])
		}
		return result
	}
}
