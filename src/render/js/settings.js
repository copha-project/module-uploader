function buildTokenItem(name,isActive,id){
    const tpl = `<div class="item">
    <label class="checkbox">
      <input type="checkbox" name='active' ${isActive? "checked":""}>
      <span class='name'>${name}</span>
      <span class='token'>${id}</span>
    </label>
    <button type='button' class="button is-small is-danger" data-id='${id}'>删除</button>
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
    const id = await fetchIdByToken(token)
    const moduleData = await fetchModule(id)
    moduleData.token = token
    moduleData.active = false
    try {
        await addModule(moduleData)
        initSettings()
    } catch (error) {
        console.log(error.message);
    }
    findElement('.settings .new-token').value = ''
}

async function removeToken(e){
    try {
        delModule(e.target.dataset.id)
        e.target.parentElement.remove()
    } catch (error) {
        alert(error.message)
    }
}

function initSettings(){
    const modules = getModuleList()
    const moduleList = findElement('.settings .token-list')
    for (const m of modules) {
        moduleList.append(buildTokenItem(m.name, m.active, m.id))
    }
    findElement('.settings .token-list').addEventListener('click', function(e){
        if(e.target.tagName === 'BUTTON'){
            removeToken(e)
        }
    })
}

;(function(){
    initSettings()
    findElement('.settings .add-token').addEventListener('click', addToken)
})()