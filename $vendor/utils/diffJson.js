class Ven$JsonDiff {
	static TYPE_CREATED = 'CREATED'
	static TYPE_UPDATED = 'UPDATED'
	static TYPE_DELETED = 'DELETED'
	static TYPE_UNCHANGED = 'UNCHANGED'

	static KEY_TYPE = '$$TYPE'
	static KEY_DATA = '$$DATA'
	static KEY_NEW_CLASSOF = '$$KEY_NEW_CLASSOF'
	static KEY_OLD_CLASSOF = '$$KEY_OLD_CLASSOF'

	static classOf(target) {
		return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
	}

	static isFunction(target) {
		return this.classOf(target) === 'function'
	}

	static isArray(target) {
		return this.classOf(target) === 'array'
	}

	static isObject(target) {
		return this.classOf(target) === 'object'
	}

	static isDate(target) {
		return this.classOf(target) === 'date'
	}

	static isUndefined(target) {
		return this.classOf(target) === 'undefined'
	}

	static isNull(target) {
		return this.classOf(target) === 'null'
	}

	static isRegexp(target) {
		return this.classOf(target) === 'regexp'
	}

	static isError(target) {
		return this.classOf(target) === 'error'
	}

	static isMap(target) {
		return this.classOf(target) === 'map'
	}

	static isWeakMap(target) {
		return this.classOf(target) === 'weakmap'
	}

	static isSet(target) {
		return this.classOf(target) === 'set'
	}

	static isWeakSet(target) {
		return this.classOf(target) === 'weakset'
	}

	static isSymbol(target) {
		return this.classOf(target) === 'symbol'
	}

	static isBigInt(target) {
		return this.classOf(target) === 'bigint'
	}
	
	static isEmpty(target) {
		if (this.isMap(target) || this.isWeakMap(target) || this.isSet(target) || this.isWeakSet(target)) {
			return target.size() <= 0
		}
		if (this.isArray(target)) {
			return target.length <= 0
		}
		if (this.isObject(target)) {
			return Object.keys(target).length <= 0
		}
		return true
	}

	static isEmptyArray(target) {
		return target.length <= 0
	}

	static isEmptyObject(target) {
		return Object.keys(target).length <= 0
	}

	static isSameType(target1, target2) {
		return this.classOf(target1) === this.classOf(target2)
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
	 * @description diff 主函数
	 * @function exec
	 * @param {object|array} obj1 对象 1(基准对象)
	 * @param {object|array} obj2 对象 2(被检查对象)
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
				[this.KEY_TYPE]: this.compareValues(obj1, obj2),
				[this.KEY_DATA]: obj1 === undefined ? obj2 : obj1,
				[this.KEY_NEW_CLASSOF]: this.classOf(obj2),
				[this.KEY_OLD_CLASSOF]: this.classOf(obj1)
			}
		}
		let hasSet = false
		for (let key in obj1) {
			if (this.isFunction(obj1[key])) {
				continue
			}
			valueOfObj2 = undefined
			if ('undefined' !== typeof obj2[key]) {
				valueOfObj2 = obj2[key]
			}
			hasSet = true
			result[key] = this.exec(obj1[key], valueOfObj2)
		}
		for (let key in obj2) {
			if (this.isFunction(obj2[key]) || 'undefined' != typeof result[key]) {
				continue
			}
			hasSet = true
			result[key] = this.exec(undefined, obj2[key])
		}
		if (!hasSet) {
			return {
				[this.KEY_TYPE]: this.isSameType(obj1, obj2) ? this.TYPE_UNCHANGED : this.TYPE_UPDATED,
				[this.KEY_DATA]: obj2 === undefined ? obj1 : obj2,
				[this.KEY_NEW_CLASSOF]: this.classOf(obj2),
				[this.KEY_OLD_CLASSOF]: this.classOf(obj1)
			}
		}
		result[this.KEY_TYPE] = this.isSameType(obj1, obj2) ? this.TYPE_UNCHANGED : this.TYPE_UPDATED
		result[this.KEY_NEW_CLASSOF] = this.classOf(obj2)
		result[this.KEY_OLD_CLASSOF] =  this.classOf(obj1)
		return result
	}
}
