function buildTokenItem(name,isActive,id){
    const tpl = `<div class="item" data-id='${id}'>
    <label class="checkbox">
      <input type="checkbox" name='active' ${isActive? "checked":""}>
      <span class='name'>${name}</span>
      <span class='token'>${id}</span>
    </label>
    <button type='button' class="button is-small is-danger">删除</button>
  </div>`
    const div = document.createElement('div')
    div.innerHTML = tpl
    return div.firstChild
}

async function addToken(){
    const token = findElement('.token-database .new-token').value
    if(!token) {
        app.showError('no token')
        return
    }
    const id = await app.api.fetchIdFromToken(token)
    if(!id) {
        app.showError('token error')
        return
    }
    const moduleData = await fetchModule(id)
    moduleData.token = token
    moduleData.active = false
    try {
        await addModule(moduleData)
        loadData()
    } catch (error) {
        app.showError(error.message)
    }
    findElement('.token-database .new-token').value = ''
}

function removeToken(id){
    try {
        delModule(id)
    } catch (error) {
        app.showError(error.message)
    }
}
function activeToken(id){
    try {
        activeModule(id)
    } catch (error) {
        app.showError(error.message)
    }
}

function loadData(){
    const modules = getModuleList()
    const moduleList = findElement('.token-database .token-list')
    moduleList.textContent = ''
    for (const m of modules) {
        moduleList.append(buildTokenItem(m.name, m.active, m.id))
    }
}

const queryParent = (node, className) => node.nodeName !== 'HTML' ? node.parentNode.classList.contains(className) ? node.parentNode : queryParent(node.parentNode,className) : null

function initSettings(){
    loadData()
    findElement('.token-database .token-list').addEventListener('click', function(e){
        e.preventDefault()
        if(['DIV'].includes(e.target.tagName)) return
        const item = queryParent(e.target,'item')
        if(e.target.tagName === 'BUTTON'){
            removeToken(item.dataset.id)
        }else if(['INPUT','SPAN'].includes(e.target.tagName)){
            activeToken(item.dataset.id)
        }
        loadData()
    })
}

;(function(){
    initSettings()
    findElement('.token-database .add-token').addEventListener('click', addToken)
})()