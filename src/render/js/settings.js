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
    const token = findElement('.settings .new-token').value
    if(!token) {
        console.log('no token');
        return
    }
    const id = fetchIdByToken(token)
    const moduleData = await fetchModule(id)
    moduleData.token = token
    moduleData.active = false
    try {
        await addModule(moduleData)
        loadData()
    } catch (error) {
        console.log(error.message);
    }
    findElement('.settings .new-token').value = ''
}

function removeToken(id){
    try {
        delModule(id)
    } catch (error) {
        console.log(error.message)
    }
}
function activeToken(id){
    try {
        activeModule(id)
    } catch (error) {
        console.log(error.message)
    }
}

function loadData(){
    const modules = getModuleList()
    const moduleList = findElement('.settings .token-list')
    moduleList.textContent = ''
    for (const m of modules) {
        moduleList.append(buildTokenItem(m.name, m.active, m.id))
    }
}

const queryParent = (node, className) => node.nodeName !== 'HTML' ? node.parentNode.classList.contains(className) ? node.parentNode : queryParent(node.parentNode,className) : null

function initSettings(){
    loadData()
    findElement('.settings .token-list').addEventListener('click', function(e){
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
    findElement('.settings .add-token').addEventListener('click', addToken)
})()