import os from 'os'
import { urlToHttpOptions, URL } from 'url'
import { validate } from 'uuid'
import {net, ClientRequestConstructorOptions} from 'electron'
import FormData from 'form-data'

export const isWin32 = os.platform() === 'win32'
export const isMac = os.platform() === 'darwin'
export const isDev = process.env.NODE_ENV === "development"
export function isUUID(s: string) {
    return validate(s)
}

export async function fetch(url:string, {body,headers}:{body?:FormData, headers?:any}, options?:ClientRequestConstructorOptions): Promise<fetchResp>{
    return new Promise((resolve,reject)=>{
        const urlData = urlToHttpOptions(new URL(url)) as ClientRequestConstructorOptions
        const request = net.request({
            ...urlData,
            ...options
        })

        const resp: fetchResp = {
            code: 200,
            headers: {},
            data: {}
        }
        request.on('response', (response) => {
            resp.code = response.statusCode
            resp.headers = JSON.stringify(response.headers)
            response.on('data', (chunk) => {
                try {
                    resp.data = JSON.parse(Buffer.from(chunk).toString())
                } catch (error) {
                    resp.data = Buffer.from(chunk).toString()
                }
            })  
            response.on('error',(e)=>{
                console.log('response error',e);
                reject(e)
            })
            response.on('end', () => {
                resolve(resp)
            })
        })
        request.on('abort',(e)=>{
            console.log('abort',e);
            reject(e)
        })
        request.on('error',(e)=>{
            console.log('error',e);
            reject(e)
        })
        if(headers){
            for (const key in headers) {
                request.setHeader(key, headers[key])
            }
        }
        if(body){
            const bodyHeaders = body.getHeaders()
            if(bodyHeaders['content-type']){
                request.setHeader('content-type', bodyHeaders['content-type'])
            }
            
            request.write(body.getBuffer())
        }
        request.end()
    })
}