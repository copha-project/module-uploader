const HOST = 'https://hub.copha.net'

const api = {
    list: HOST+'/api/v1/modules/',
    upload: HOST+'/upload'
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

const fetchIdByToken = token => {
    const id = hex2a(token.split(':')[0])
    return Promise.resolve(id)
}

const fetchModule = id => {
    return fetch(api.list+id).then( async e=>{
        if(e.ok){
            return e.json()
        }
        throw Error((await e.json()).message)
    })
}

const uploadPoint = () => {

}

const uploadModule = (postData, token) => {
    uploadPoint().then(uploadUrl =>{
        const request = new XMLHttpRequest()
        request.open("POST", uploadUrl);
        request.setRequestHeader("authorization",token)
        request.send(postData)
    })
}