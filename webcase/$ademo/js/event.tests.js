// function printEvent(tag, e) {
//     console.log(`=========================`)
//     console.log(`事件标记: ${tag}`)
//     console.log(`事件触发源元素 ID: ${e.target.id}`)
//     console.log(`事件绑定宿主元素 ID: ${e.currentTarget.id}`)
// }

// function insertHtml(container) {
//     container.innerHTML = `
//         <div id="boxLayer1" class="box" style="width: 500px; height: 500px; background-color: rgba(255, 0, 0, 0.5);">
//             boxLayer1
//             <div id="boxLayer2" class="box" style="width: 400px; height: 400px; background-color: rgba(255, 255, 0, 0.5);">
//                 boxLayer2
//                 <div id="boxLayer3" class="box" style="width: 300px; height: 300px; background-color: rgba(0, 255, 0, 0.5);">
//                     boxLayer3
//                     <div id="boxLayer4" class="box" style="width: 200px; height: 200px; background-color: rgba(0, 255, 255, 0.5);">
//                         boxLayer4
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `
// }

// function bindEvent() {
//     ven$bindEvent(appContainer, 'click', '.box', function(e) {
//         printEvent('event-appContainer', e)
//     }, false)

//     ven$bindEvent(boxLayer1, 'click', function(e) {
//         printEvent('event-boxLayer1', e)
//     })

//     ven$bindEvent(boxLayer2, 'click', function(e) {
//         // e.stopPropagation()
//         // e.stopImmediatePropagation()
//         printEvent('event-boxLayer2', e)
//     })

//     ven$bindEvent(boxLayer2, 'click', function(e) {
//         printEvent('event-boxLayer2 02', e)
//     })

//     ven$bindEvent(boxLayer3, 'click', function(e) {
//         printEvent('event-boxLayer3', e)
//     })

//     ven$bindEvent(boxLayer4, 'click', function(e) {
//         printEvent('event-boxLayer4', e)
//     })
// }

// function main() {
//     insertHtml(appContainer)
//     bindEvent()
// }

// document.addEventListener('DOMContentLoaded', function() {
//     main()
// })
