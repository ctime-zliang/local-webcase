// /* 
//     https://zhuanlan.zhihu.com/p/142742003
//  */


// let time = {}
// function taskTest() {
//     console.log(`=======================`)
//     window.setTimeout(() => {
//         window.requestAnimationFrame(() => {
//             time.st1RAf1 = performance.now()
//             console.log(`rAF 1 - setTimeout 1`)
//         })
//         window.requestAnimationFrame(() => {
//             time.st1RAf2 = performance.now()
//             console.log(`rAF 2 - setTimeout 1`)
//         })
//         console.log(`setTimeout 1`)
//         time.st1 = performance.now()
//         // ven$choke(100)
//         // document.body.innerHTML = `<div>${Math.random()}</div>`
//         document.body.innerHTML = createHtmlString()
//     })
//     window.setTimeout(() => {
//         window.requestAnimationFrame(() => {
//             time.st2RAf1 = performance.now()
//             console.log(`rAF 1 - setTimeout 2`)
//         })
//         window.requestAnimationFrame(() => {
//             time.st2RAf2 = performance.now()
//             console.log(`rAF 2 - setTimeout 2`)
//         })
//         console.log(`setTimeout 2`)
//         time.st2 = performance.now()
//     })
//     Promise.resolve().then(() => {
//         time.rAf1 = performance.now()
//         console.log(`promise 1`)
//     })
//     Promise.resolve().then(() => {        
//         console.log(`promise 2`)
//     })
//     window.requestAnimationFrame(() => {
//         time.rAf1 = performance.now()
//         console.log(`rAF 1`)
//     })
//     window.requestAnimationFrame(() => {
//         time.rAf2 = performance.now()
//         console.log(`rAF 2`)
//     })

//     window.setTimeout(() => {
//         console.log(time)
//     }, 750)
// }

// function createHtmlString() {
//     let htmlString = ``
//     for (let i = 0; i < 1000; i++) {
//         htmlString += `<div>${i} - ${Math.random()}</div>`
//     }
//     return htmlString
// }

// document.body.addEventListener(`click`, function() {
//     document.body.innerHTML = ''
//     taskTest()
// })
