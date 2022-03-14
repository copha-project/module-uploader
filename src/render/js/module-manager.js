function ModuleManager(options){
    this.HOST = options.host
    this.api = {
        list: this.HOST + "/api/v1/modules/",
        uploadHost: this.HOST + '/api/v1/package_hosts/'
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
    const fetchOptions = {
        method: options.method || 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'authorization': options.token || '',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer'
    }

    if(Object.keys(data).length) {
        fetchOptions.body = JSON.stringify(data)
    }

    const response = await fetch(url, fetchOptions);
    if(!response.ok) throw Error(response.statusText) // http 代码
    const resData = await response.json()   
    if(resData.code !== 200) throw Error(resData.msg) // 业务代码
    return resData.data
}

ModuleManager.prototype.saveRemoteModule = async function (module, updateData){
    const reqUrl = this.api.list + module.id
    return this.reqBuilder(reqUrl, updateData, {
        method: 'PUT',
        token : module.token
    })
}

ModuleManager.prototype.addRemotePackage = async function (module, packageData){
    const reqUrl = this.api.list + module.id + '/packages'
    // const reqUrl = 'http://localhost:4396/api/v1/modules/'+module.name+'/packages'
    return this.reqBuilder(reqUrl, packageData, {
        method: 'POST',
        token : module.token,
    })
}

ModuleManager.prototype.getUploadPoint = async function(module){
    const hostResp = await this.reqBuilder(this.api.uploadHost + module.packageHost)
    return hostResp.uploadPoint + '/' + module.id
}

ModuleManager.prototype.uploadRemotePackage = async function (module,{version,package}){
    const uploadPoint = await this.getUploadPoint(module)
    const uploadRes = await app.api.uploadPackage(module.token, package, uploadPoint, version)
    if(uploadRes.code!==0) throw Error(uploadRes.msg)
    console.log('uploadRemotePackage: ', uploadRes)
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