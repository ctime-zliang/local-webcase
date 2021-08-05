const MAX_LENGTH = 30000

const innerHtml = (count = 0) => {
    let html = ``
    for (let i = 0; i < MAX_LENGTH; i++) {
        html += `<li>${i} - ${count}</li>`
    }
    ulist.innerHTML = html
}

const appendChild = (count) => {
    let li = null
    let text = null
    for (let i = 0; i < MAX_LENGTH; i++) {
        text = document.createTextNode(`${i} - ${count}`)
        li = document.createElement('li')
        li.appendChild(text)
        ulist.appendChild(li)
    }
}

let c1 = 0
btn1.onclick = () => {
    innerHtml(c1++)
}
let c2 = 0
btn2.onclick = () => {
    appendChild(c2++)
}