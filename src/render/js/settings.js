const settingsSelector = '.modal.sys-settings '
function initEvent(){
    findElement(".open-settings").addEventListener("click", showSettingsDialog)
    findElement(settingsSelector + ".close").addEventListener("click", closeSettingsDialog)

    findElement(settingsSelector + '.open-devtools').addEventListener('click', openDevTools)

    findElement(settingsSelector + ' .resync').addEventListener('click', syncModuleData)
}

function showSettingsDialog(){
    findElement(".modal.sys-settings").classList.add("is-active");
}

function closeSettingsDialog(){
    findElement(".modal.sys-settings").classList.remove("is-active")
}

async function syncModuleData(){
    try {
        await syncActiveModule()
        await loadModuleData()
    } catch (error) {
        app.showError(error.message)
        return
    }
    app.showMsg("Sync module info success.")
}

function openDevTools(){
    app.openDevTools()
}

async function hideDebugItem(){
    if(!await app.isPackaged()){
        findElement(settingsSelector+'.open-devtools').classList.remove('hide')
    }
}

;(async () => {
    await hideDebugItem()
    initEvent()
})()