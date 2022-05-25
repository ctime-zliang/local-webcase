// function insertHtml() {
//     const appContainer = document.getElementById('appContainer')
//     appContainer.innerHTML = `
//         <div>
//             <button id="startAnimateBtn" class="btn btn-default">Start Animate</button>
//         </div>
//     `
//     /* ... */
//     let boxHtml = '<div>'
//     for (let i = 0; i < 100; i++) {
//         let itemTop = 0 + 100 * i + i * 5
//         boxHtml += `<div class="box" style="position: absolute; left: 0; top: ${itemTop}px; width: 100px; height: 100px; background-color: #ff6600;"></div>`
//     }
//     boxHtml += `</div>`
//     document.body.appendChild(ven$createElementFragment(boxHtml))
// }

// function jQueryAnimate() {
//     $('.box').stop().animate(
//         {
//             left: 800,
//             width: 200
//         },
//         1000,
//         'linear'
//     )
// }

// function bindEvent() {
//     const startAnimateBtn = document.getElementById('startAnimateBtn')
//     ven$bindEvent(startAnimateBtn, 'click', function() {
//         jQueryAnimate()
//     })
// }

// function main() {
//     insertHtml()
//     bindEvent()
// }

// document.addEventListener('DOMContentLoaded', function() {
//     main()
// })