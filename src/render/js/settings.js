const settingsSelector = '.modal.sys-settings '
function initEvent(){
    findElement(".open-settings").addEventListener("click", function () {
        findElement(".modal.sys-settings").classList.add("is-active");
    });

    findElement(".modal.sys-settings .close").addEventListener("click", async function () {
        findElement(".modal.sys-settings").classList.remove("is-active")
    });
    findElement(settingsSelector + '.open-devtools').addEventListener('click', app.openDevTools)

    findElement(settingsSelector + ' .resync').addEventListener('click', async ()=>{
        await syncActiveModule()
        await loadModuleData()
    })
}

; (async () => {
    if(!await app.isPackaged()){
        findElement(settingsSelector+'.open-devtools').classList.remove('hide')
    }
    initEvent()
})()