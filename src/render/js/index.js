const HOST = "https://hub.copha.net";

const api = {
  list: HOST + "/api/v1/modules/",
  upload: HOST + "/upload",
  package_hosts: HOST + "/package_hosts",
};

function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

const fetchIdByToken = (token) => {
  const id = hex2a(token.split(":")[0]);
  return Promise.resolve(id);
};

const fetchModule = (id) => {
  return fetch(api.list + id).then(async (e) => {
    if (e.ok) {
      return e.json();
    }
    throw Error((await e.json()).message);
  });
};

const getUploadPoint = async () => {
  const hosts_info = await fetch(api.package_hosts).then((e) => e.json());
  if (hosts_info.hosts.length == 0) throw Error("not found a upload Point");
  return hosts_info.hosts[0] + hosts_info.api.upload;
};

const uploadModule = (postData, token) => {
  getUploadPoint().then((uploadUrl) => {
    console.log(postData);
    // const request = new XMLHttpRequest()
    // request.open("POST", uploadUrl);
    // request.setRequestHeader("authorization",token)
    // request.send(postData)
  });
};

function findElement(e) {
  return document.querySelector(e);
}

function findElements(e) {
  return document.querySelectorAll(e);
}

function signToken() {
  const tokenDom = findElement("#token");
  if (!tokenDom.value) alert("no token");
  localStorage.setItem("token", tokenDom.value);
  initWithToken(tokenDom.value);
}

function upload() {
  findElement(".loading").style.setProperty("display", "flex");
  // const token = localStorage.getItem("token");
  // const version = findElement("input[name=moduleVer]").value;
  // const formData = new FormData();
  // formData.append("version", version);

  // const fileDom = findElement("input[name=package]");
  // formData.append("package", fileDom.files[0]);
  // uploadModule(formData, token);
}

function initWithToken(token) {
  fetchIdByToken(token).then((id) => {
    findElement("input[name=moduleId]").value = id;
    fetchModule(id)
      .then((data) => {
        findElement("input[name=moduleName]").value = data.name;
      })
      .catch(console.log);
  });
}

async function openFileSelect(e) {
  const filePath = await app.api.openFileSelectorDialog();
  if (!filePath) return;
  const fileInfo = await app.api.getModuleInfo(filePath);
  findElement("input[name=hashSha1]").value = fileInfo.sha1;
  findElement("input[name=hashMd5]").value = fileInfo.md5;
}

function loadModuleInfo(item){
  findElement('.module-view .module_name').textContent = item.name
  findElement('.module-view .module_id').textContent = item.id
  findElement('.module-view .module_type').textContent = item.type
  
  findElement('.module-view .module_repo').textContent = item.repository
  findElement('.module-view input[name="module_repo_edit"]').value = item.repository

  findElement('.module-view .module_desc').textContent = item.desc
  findElement('.module-view textarea[name="module_desc_edit"]').value = item.desc
}
function loadPackageInfo(item){
  if(item.packages.length){
    findElement('.package-view .module_latest').textContent = item.packages[0].version
    findElement('.package-view .module_count').textContent = item.packages.length
  }else{
    findElement('.package-view .module_latest').textContent = 'None'
    findElement('.package-view .module_count').textContent = 0
  }
}

async function loadModuleData(){
  const moduleItem = await getActiveModule()
  loadModuleInfo(moduleItem)
  loadPackageInfo(moduleItem)
}

;(async function () {
  await loadModuleData()

  findElement(".open-settings").addEventListener("click", function () {
    findElement(".modal.settings").classList.add("is-active");
  });

  findElement(".settings .close").addEventListener("click", async function () {
    findElement(".modal.settings").classList.remove("is-active");
    await loadModuleData()
  });

  findElement("#open-select-file").addEventListener("click", openFileSelect);
  findElement(".submit").addEventListener("click", upload);
  findElement(".quit").addEventListener("click", app.exit);
  findElement(".cancel-upload").addEventListener("click", () => {
    const loading = findElement(".loading");
    loading.style.setProperty("display", "none");
  });

  findElement('.module-view .module-edit').addEventListener('click',function(e){
    if(e.target.classList.contains('fa-window-close')){
      e.target.classList.replace('fa-window-close','fa-pen-square')
      findElement('.module-view .module-save').style.setProperty('display','none')

      findElement('.module-view .module_repo').style.setProperty('display','unset')
      findElement('.module-view input[name="module_repo_edit"]').style.setProperty('display','none')
    
      findElement('.module-view .module_desc').style.setProperty('display','unset')
      findElement('.module-view textarea[name="module_desc_edit"]').style.setProperty('display','none')
      
    }else{
      e.target.classList.replace('fa-pen-square','fa-window-close')
      findElement('.module-view .module-save').style.setProperty('display','block')
      
      findElement('.module-view .module_repo').style.setProperty('display','none')
      findElement('.module-view input[name="module_repo_edit"]').style.setProperty('display','unset')
    
      findElement('.module-view .module_desc').style.setProperty('display','none')
      findElement('.module-view textarea[name="module_desc_edit"]').style.setProperty('display','unset')

    }
  })
})();
