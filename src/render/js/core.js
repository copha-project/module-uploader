function findElement(e) {
    return document.querySelector(e)
}

function findElements(e) {
    return Array.from(document.querySelectorAll(e))
}

function sleep(t){
    return new Promise(resolve => {
      setTimeout(()=>{
        resolve()
      },t)
    })
}