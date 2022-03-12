function versionPatchIncrement(version){
  let verArr = version.split('.')
  verArr[verArr.length-1] ++
  return verArr.join('.')
}

async function upload() {
  const activeModule = await moduleManager.getActiveModule()
  if(!activeModule) {
    app.showError("no module selected")
    return
  }
  
  function closeLoading(){
    findElement(".loading").style.setProperty("display", "none");
    findElements('.upload-progress .step').map(resetTaskView)
    const doneBtn = findElement('.upload-loading-view .button')
    doneBtn.textContent = "Cancel"
    doneBtn.classList.replace('is-success','is-danger')
  }
  function resetTaskView(step){
    const iconSpan = step.querySelector('.icon')
    const icon = iconSpan.querySelector('i')

    iconSpan.classList.remove('has-text-success','has-text-warning')
    iconSpan.classList.add('has-text-white')
    icon.classList.remove('fa-check-circle','fa-spinner','fa-pulse')
    icon.classList.add('fa-clock')
  }
  function showStart(ele){
    const iconSpan = ele.querySelector('.icon')
    const icon = iconSpan.querySelector('i')
    iconSpan.classList.replace('has-text-white','has-text-warning')
    icon.classList.replace('fa-clock','fa-spinner')
    icon.classList.add('fa-pulse')
  }
  function showEnd(ele){
    const iconSpan = ele.querySelector('.icon')
    const icon = iconSpan.querySelector('i')
    iconSpan.classList.replace('has-text-warning','has-text-success')
    icon.classList.remove('fa-spinner','fa-pulse')
    icon.classList.add('fa-check-circle')
  }
  function changeToDoneView(){
    const doneBtn = findElement('.upload-loading-view .button')
    doneBtn.textContent = "Done"
    doneBtn.classList.replace('is-danger','is-success')
    findElement(".upload-loading-view .cancel-upload").addEventListener("click", closeLoading, {once:true});
  }
  async function verifyInfo(packageData){
    const stepIcon = findElement('.upload-progress .step-1')
    showStart(stepIcon)
    await sleep(1000)
    if(!packageData.version){
      throw Error("not set version")
    }
    if(!await app.validateVersion(packageData.version)){
      throw Error("version format error")
    }
    if(activeModule.packages.find(p=>p.version === packageData.version)){
      throw Error("version already exists")
    }
    await sleep(1000)
    showEnd(stepIcon)
  }
  async function uploadPackage(packageData){
    const stepIcon = findElement('.upload-progress .step-2')
    showStart(stepIcon)
    await sleep(1000)
    await moduleManager.uploadRemotePackage(activeModule, packageData)
    await sleep(1000)
    showEnd(stepIcon)
  }
  async function registerVersion(packageData){
    const stepIcon = findElement('.upload-progress .step-3')
    showStart(stepIcon)
    await sleep(1000)
    delete packageData.package
    await moduleManager.addRemotePackage(activeModule,packageData)
    await sleep(1000)
    showEnd(stepIcon)
  }
  
  const filePath = findElement(".upload-view input[name=tmpFile]").value;
  if(!filePath){
    app.showError("no file selected!")
    return
  }
  showLoading()
  const packageData = {
    package: filePath,
    sha1: findElement("input[name=hashSha1]").value,
    md5: findElement("input[name=hashMd5]").value,
    version: findElement(".upload-view input[name=moduleVer]").value
  }

  try {
    await verifyInfo(packageData)
    await uploadPackage(packageData)
    await registerVersion(packageData)
    changeToDoneView()
  } catch (error) {
    app.showError(error.message)
    console.log(error);
    closeLoading()
  }
}

async function openFileSelect(e) {
  const activeModule = await moduleManager.getActiveModule()
  if(!activeModule) {
    app.showError("no module selected")
    return
  }
  const filePath = await app.api.openFileSelectorDialog()
  if (!filePath) {
    return
  }
  findElement('.upload-view input[name=tmpFile]').value = filePath
  const fileInfo = await app.api.getModuleInfo(filePath)
  findElement("input[name=hashSha1]").value = fileInfo.sha1
  findElement("input[name=hashMd5]").value = fileInfo.md5
  if(activeModule.packages.length>0){
    findElement("input[name=moduleVer]").value = versionPatchIncrement(activeModule.packages[0].version);
  }
}

function showLoading(){
  findElement(".loading").style.setProperty("display", "flex");
}

function resetModuleInfo(){
  loadModuleInfo({})
  loadPackageInfo({})
}

function loadModuleInfo(item){
  findElement('.module-view .module_name').textContent = item.name || 'No Module'
  findElement('.module-view .module_id').textContent = item.id  || ''
  findElement('.module-view .module_type').textContent = item.type  || ''
  
  findElement('.module-view .module_repo').textContent = item.repository  || ''
  findElement('.module-view input[name="module_repo_edit"]').value = item.repository  || ''

  findElement('.module-view .module_desc').textContent = item.desc  || ''
  findElement('.module-view textarea[name="module_desc_edit"]').value = item.desc  || ''
}

function loadPackageInfo(item){
  if(item?.packages?.length){
    findElement('.package-view .module_latest').textContent = item.packages[0].version
    findElement('.package-view .module_count').textContent = item.packages.length
  }else{
    findElement('.package-view .module_latest').textContent = 'None'
    findElement('.package-view .module_count').textContent = 0
  }
}

async function loadModuleData(){
  const moduleItem = await moduleManager.getActiveModule()
  if(moduleItem){
    loadModuleInfo(moduleItem)
    loadPackageInfo(moduleItem)
  }else{
    resetModuleInfo()
  }
}

function showModuleListDialog(){
  findElement(moduleListDialogSelector).classList.add("is-active");
}

function quitApp(){
  app.exit()
}

async function saveModuleInfo(e){
  e.currentTarget.blur()
  const repo = findElement('.module-view input[name="module_repo_edit"]').value
  const desc = findElement('.module-view textarea[name="module_desc_edit"]').value

  if(!repo || !desc) return
  const moduleItem = await moduleManager.getActiveModule()
  if(moduleItem.repository === repo && moduleItem.desc === desc) {
    app.showMsg("data not change")
    return
  }
  moduleManager.saveRemoteModule(moduleItem,{repository: repo,desc})
  .then(res=>{
    console.log(res)
    app.showMsg(res)
  })
  .catch(err=>{
    app.showError(err.message)
  })
}

async function editModuleInfoEvent(){
  function closeModuleInfoEdit(){
    findElement('.module-view .module-edit').classList.replace('fa-window-close','fa-pen-square')
    findElement('.module-view .module-save').style.setProperty('display','none')
    
    findElement('.module-view .module_repo').style.setProperty('display','unset')
    findElement('.module-view input[name="module_repo_edit"]').style.setProperty('display','none')
  
    findElement('.module-view .module_desc').style.setProperty('display','unset')
    findElement('.module-view textarea[name="module_desc_edit"]').style.setProperty('display','none')
    
    findElement('.module-view .module-save').removeEventListener('click', saveModuleInfo)
  }
  
  function openModuleInfoEdit(){
    findElement('.module-view .module-edit').classList.replace('fa-pen-square','fa-window-close')
    findElement('.module-view .module-save').style.setProperty('display','block')
    
    findElement('.module-view .module_repo').style.setProperty('display','none')
    findElement('.module-view input[name="module_repo_edit"]').style.setProperty('display','unset')
  
    findElement('.module-view .module_desc').style.setProperty('display','none')
    findElement('.module-view textarea[name="module_desc_edit"]').style.setProperty('display','unset')
    
    findElement('.module-view .module-save').addEventListener('click', saveModuleInfo)
  }
  
  function moduleInfoEditIsOpen(){
    return findElement('.module-view .module-edit').classList.contains('fa-window-close')
  }

  const activeModule = moduleManager.getActiveModule()
  if(!activeModule) {
    app.showError("no module selected")
    return
  }
  if(moduleInfoEditIsOpen()){
    closeModuleInfoEdit()
  }else{
    openModuleInfoEdit()
  }
}

;(async function (w) {
  const moduleManager = new ModuleManager({host: app.api.HOST})
  w.moduleManager = moduleManager
  await loadModuleData()
  
  findElement(".open-module-list").addEventListener("click", showModuleListDialog);
  findElement("#open-select-file").addEventListener("click", openFileSelect);
  findElement(".upload-view .submit").addEventListener("click", upload);
  findElement(".quit").addEventListener("click", quitApp);
  findElement('.module-view .module-edit').addEventListener('click', editModuleInfoEvent)
})(window);
