const moduleListDialogSelector = '.modal.module-list-dialog '

function buildModuleItem({id,name,active}){
    const tpl = `<div class="item" data-id='${id}'>
                    <label class="checkbox">
                    <input type="checkbox" name='active' ${active? "checked":""}>
                    <span class='name'>${name}</span>
                    <span class='id'>${id}</span>
                    </label>
                    <button type='button' class="button is-small is-danger">删除</button>
                </div>`
    const div = document.createElement('div')
    div.innerHTML = tpl
    return div.firstChild
}

async function addModule(){
    const id = findElement(moduleListDialogSelector + '.module-id').value
    if(!id) {
        app.showError('no id')
        return
    }
    
    try {
        const moduleData = await moduleManager.fetchRemoteModule(id)
        moduleData.token = ''
        moduleData.active = false
        await moduleManager.addModule(moduleData)
        loadModuleList()
    } catch (error) {
        app.showError(error.message)
    }
    findElement(moduleListDialogSelector + '.module-id').value = ''
}

function removeModule(id){
    try {
        delModule(id)
    } catch (error) {
        app.showError(error.message)
    }
}

function activeModule(id){
    try {
        activeModule(id)
    } catch (error) {
        app.showError(error.message)
    }
}

function loadModuleList(){
    const modules = moduleManager.getModuleList()
    const moduleList = findElement(moduleListDialogSelector + '.module-list')
    moduleList.textContent = ''
    for (const m of modules) {
        moduleList.append(buildModuleItem(m))
    }
}

async function closeModuleListDialog(){
    findElement(moduleListDialogSelector).classList.remove("is-active");
    await loadModuleData()
}

function moduleItemClickEvent(e){
    e.preventDefault()
    if(['DIV'].includes(e.target.tagName)) return

    const queryParent = (node, className) => node.nodeName !== 'HTML' ? node.parentNode.classList.contains(className) ? node.parentNode : queryParent(node.parentNode,className) : null

    const item = queryParent(e.target,'item')
    if(e.target.tagName === 'BUTTON'){
        removeModule(item.dataset.id)
    }else if(['INPUT','SPAN'].includes(e.target.tagName)){
        activeModule(item.dataset.id)
    }
    loadModuleList()
}

function initSettings(){
    loadModuleList()
    findElement(moduleListDialogSelector + '.add-module').addEventListener('click', addModule)
    findElement(moduleListDialogSelector + '.module-list').addEventListener('click', moduleItemClickEvent)
    findElement(moduleListDialogSelector + ".close").addEventListener("click", closeModuleListDialog);
}

;(function(){
    initSettings()
})()