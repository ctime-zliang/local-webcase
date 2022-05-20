// let time = {}
// function taskTest() {
//     window.setTimeout(() => {
//         time.start = performance.now()
//         console.log(`setTimeout 1`)
//         // document.body.innerHTML = createHtmlString()
//         window.requestAnimationFrame(() => {
//             console.log(`rAF 1`)
//         })
//     })
//     window.setTimeout(() => {
//         console.log(`setTimeout 2`, performance.now() - time.start)
//         window.requestAnimationFrame(() => {
//             console.log(`rAF 2`)
//         })
//     })
//     Promise.resolve().then(() => {
//         console.log(`promise 1`)
//     })
//     Promise.resolve().then(() => {
//         console.log(`promise 2`)
//     })
// }

// function createHtmlString() {
//     let htmlString = ``
//     for (let i = 0; i < 10000; i++) {
//         htmlString += `<div>${i} - ${Math.random()}</div>`
//     }
//     return htmlString
// }

// document.body.addEventListener(`click`, function() {
//     document.body.innerHTML = ''
//     taskTest()
// })
