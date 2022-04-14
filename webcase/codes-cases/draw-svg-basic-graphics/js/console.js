/*
    console.js

    重载console函数
    日志上报
 */

const _console = console

console = {
    log(content) {
        // 其他操作
        _console.info('提示：')
        _console.log(content)
    },
    warn(content) {
        // 其他操作
        _console.info('提示：')
        _console.warn(content)
    },
    info(content) {
        // 其他操作
        _console.info('提示：')
        _console.info(content)
    },
    error(content) {
        // 其他操作
        _console.info('提示：')
        _console.error(content)
    },
    time(content) {
        // 其他操作
        _console.info('提示：')
        _console.time(content)
    },
    timeEnd(content) {
        // 其他操作
        _console.info('提示：')
        _console.timeEnd(content)
    },
    table(content) {
        // 其他操作
        _console.info('提示：')
        _console.table(content)
    },
    trace(content) {
        // 其他操作
        _console.info('提示：')
        _console.trace(content)
    },
    count(content) {
        // 其他操作
        _console.info('提示：')
        _console.count( content)
    },
    assert(content) {
        // 其他操作
        _console.info('提示：')
        _console.assert(content)
    },
    group(content) {
        // 其他操作
        _console.info('提示：')
        _console.group(content)
    },
    groupEnd(content) {
        // 其他操作
        _console.info('提示：')
        _console.groupEnd(content)
    }
}
