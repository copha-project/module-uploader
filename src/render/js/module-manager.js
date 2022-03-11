function ModuleManager(options){
    this.HOST = options.host
    this.api = {
        list: this.HOST + "/api/v1/modules/"
    }
}

ModuleManager.prototype.getModuleList = function(){
    let modules = []
    try {
        modules = JSON.parse(localStorage.modules || '[]')
    } catch (error) {
        
    }
    return modules
}

ModuleManager.prototype.saveModuleList = function(list){
    localStorage.setItem('modules', JSON.stringify(list))
}

ModuleManager.prototype.addModule = function (m){
    const modules = this.getModuleList()
    if(modules.find(e=>e.id === m.id)) throw Error('token has exist!')
    modules.push(m)
    this.saveModuleList(modules)
}

ModuleManager.prototype.delModule = function (id){
    const modules = this.getModuleList()
    const index = modules.findIndex(e=>e.id === id)
    if(index === -1) throw Error('token not exist!')
    modules.splice(index,1)
    this.saveModuleList(modules)
}

ModuleManager.prototype.updateModule = function (module){
    const modules = this.getModuleList()
    const index = modules.findIndex(e=>e.id === module.id)
    if(index === -1) throw Error('token not exist!')
    modules.splice(index,1)
    modules.push(module)
    this.saveModuleList(modules)
}

ModuleManager.prototype.syncActiveModule = async function (){
    const localModule = this.getActiveModule()
    if(!localModule) {
        throw new Error("no module selected")
    }
    const moduleData = await this.fetchRemoteModule(localModule.id)
    moduleData.token = localModule.token
    moduleData.active = true
    this.updateModule(moduleData)
}

ModuleManager.prototype.activeModule = function (id){
    const modules = this.getModuleList()
    modules.map(e=>{
        if(e.id === id){
            e.active = true
        }else{
            e.active = false
        }
    })
    this.saveModuleList(modules)
}

ModuleManager.prototype.getActiveModule = function (){
    const modules = this.getModuleList()
    if(!modules.length) return null
    let activeModule = modules.find(e=>e.active)
    if(!activeModule){
        modules[0].active = true
        this.saveModuleList(modules)
        activeModule = modules[0]
    }
    return activeModule
}

ModuleManager.prototype.reqBuilder = async function (url = '', data = {}, options = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: options.method || 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'authorization': options.token || '',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const resData = await response.json()
    if(resData.code) throw Error(resData.message)
    return resData; // parses JSON response into native JavaScript objects
}

ModuleManager.prototype.saveRemoteModule = async function (module, updateData){
    const reqUrl = this.api.list + module.id
    return reqBuilder(reqUrl, updateData, {
        method: 'PUT',
        token : module.token,
    })
}

ModuleManager.prototype.addRemotePackage = async function (module, packageData){
    const reqUrl = this.api.list + module.id + '/packages'
    // const reqUrl = 'http://localhost:4396/api/v1/modules/'+module.name+'/packages'
    return reqBuilder(reqUrl,packageData, {
        method: 'POST',
        token : module.token,
    })
}

ModuleManager.prototype.uploadRemotePackage = async function (module,{version,package}){
    const uploadRes = await app.api.uploadPackage(module.id, module.token, package, version)
    if(uploadRes.code!==0) throw Error(uploadRes.msg)
    console.log(uploadRes);
}

ModuleManager.prototype.fetchRemoteModule = async function(id) {
    return fetch(this.api.list + id).then(async (e) => {
      if (e.ok) {
        const res = await e.json()
        if(res.code !== 200) throw Error(res.msg)
        return res.data
      }
      throw Error((await e.json()).message);
    });
}