function getModuleList(){
    let modules = []
    try {
        modules = JSON.parse(localStorage.modules || '[]')
    } catch (error) {
        
    }
    return modules
}
function saveModuleList(list){
    localStorage.setItem('modules', JSON.stringify(list))
}
async function addModule(m){
    const modules = getModuleList()
    if(modules.find(e=>e.id === m.id)) throw Error('token has exist!')
    modules.push(m)
    saveModuleList(modules)
}
async function delModule(id){
    const modules = getModuleList()
    const index = modules.findIndex(e=>e.id === id)
    if(index === -1) throw Error('token not exist!')
    modules.splice(index,1)
    saveModuleList(modules)
}