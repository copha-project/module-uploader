function findElement(e) {
    return document.querySelector(e);
}

function findElements(e) {
    return Array.from(document.querySelectorAll(e))
}