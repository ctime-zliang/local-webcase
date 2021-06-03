async function fn() {
    console.log(0)
    return new Promise((_, rj) => {
        console.log(1)
        window.setTimeout(() => {
            _(123)
        }, 1000)
    })
}

async function run() {
    const res = await fn()
    console.log(res)
}

run()