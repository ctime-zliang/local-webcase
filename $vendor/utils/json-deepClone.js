/**
 * @description JSON 深拷贝
 * @function ven$deepClone
 * @param {object|array} json 被深拷贝的 JSON 数据
 * @return {object|array}
 */
function ven$deepClone(json) {
    let wMap = new WeakMap()
    return traverse(json)

    function traverse(obj){
        const result = {}
        let keys = []
        let item = null        

        if (wMap.get(obj)) {
            return wMap.get(obj)
        }
        keys = Object.keys(obj)
        wMap.set(obj, result)

        for (let i = 0; i < keys.length; i++) {
            item = obj[keys[i]]
            if (item && Object.prototype.toString.call(item).slice(8, -1).toLowerCase() === 'object') {
                result[keys[i]] = traverse(item)
            } else {
                result[keys[i]] = item
            }
        }        
        return result    
    }
}