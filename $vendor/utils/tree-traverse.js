/**
 * 深度优先遍历
 * @param {object} node 起始节点
 * @return {array<object>}
 */
function ven$dfs1(node = null) {
    const nodelist = []
    traverse(node, nodelist)
    return nodelist
    
    function traverse(node, nodelist) {
        const children = []
        if (node){
            nodelist.push(node)
            children = node.children
            for (let i = 0; i < children.length; i++) {
                traverse(children[i], nodelist)
            }
        }
    }
}

/**
 * 深度优先遍历
 * @param {object} node 起始节点
 * @return {array<object>}
 */
function ven$dfs2(node = null) {
    const nodelist = []
    const item = null 
    const stack = []
     
    if (node) {
        stack.push(node)
        while (stack.length) {
            item = stack.pop()
            nodelist.push(item)
            children = item.children
            for (let i = children.length - 1; i >= 0; i--) {
                stack.push(children[i])
            }
        }
    }
    return nodelist
}


/**
 * 广度优先遍历
 * @param {object} node 起始节点
 * @return {array<object>}
 */
function ven$bfs(node = null) {
    const nodelist = []
    const children = []
    const item = null
    const queue = []

    if (node) {
        queue.push(node)
        while (queue.length) {
            item = queue.shift()
            nodelist.push( item )
            children = item.children
            for (let i = 0; i < children.length; i++) {
                queue.push(children[i])
            }
        }
    }
    return nodelist
}