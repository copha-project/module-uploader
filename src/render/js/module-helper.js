const HOST = "https://hub.copha.net";

const api = {
  list: HOST + "/api/v1/modules/",
  upload: HOST + "/upload",
  package_hosts: HOST + "/package_hosts",
};

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

async function updateModule(module){
    const modules = getModuleList()
    const index = modules.findIndex(e=>e.id === module.id)
    if(index === -1) throw Error('token not exist!')
    modules.splice(index,1)
    modules.push(module)
    saveModuleList(modules)
}

async function syncActiveModule(){
    const localModule = await getActiveModule()
    if(!localModule) {
        app.showError("no module selected")
        return
    }
    const moduleData = await fetchRemoteModule(localModule.id)
    moduleData.token = localModule.token
    moduleData.active = true
    return updateModule(moduleData)
}

async function activeModule(id){
    const modules = getModuleList()
    modules.map(e=>{
        if(e.id === id){
            e.active = true
        }else{
            e.active = false
        }
    })
    saveModuleList(modules)
}

async function getActiveModule(){
    const modules = await getModuleList()
    if(!modules.length) return null
    let activeModule = modules.find(e=>e.active)
    if(!activeModule){
        modules[0].active = true
        await saveModuleList(modules)
        activeModule = modules[0]
    }
    return activeModule
}

async function reqBuilder(url = '', data = {}, options = {}) {
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

async function saveRemoteModule(module, updateData){
    const reqUrl = api.list+module.name
    return reqBuilder(reqUrl,updateData, {
        method: 'PUT',
        token : module.token,
    })
}

async function addRemotePackage(module, packageData){
    const reqUrl = api.list+module.name+'/packages'
    // const reqUrl = 'http://localhost:4396/api/v1/modules/'+module.name+'/packages'
    return reqBuilder(reqUrl,packageData, {
        method: 'POST',
        token : module.token,
    })
}

async function uploadRemotePackage(module,{version,package}){
    const uploadRes = await app.api.uploadPackage(module.token,package,version)
    if(uploadRes.code!==0) throw Error(uploadRes.msg)
    console.log(uploadRes);
};

const fetchRemoteModule = (id) => {
    return fetch(api.list + id).then(async (e) => {
      if (e.ok) {
        return e.json()
      }
      throw Error((await e.json()).message);
    });
};