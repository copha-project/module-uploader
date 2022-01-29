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

export async function fetch(url:string, body?:FormData, options?:ClientRequestConstructorOptions){
    return new Promise((resolve,reject)=>{
        const urlData = urlToHttpOptions(new URL(url)) as ClientRequestConstructorOptions
        const request = net.request({
            ...urlData,
            
            ...options
        })

        const resp = {
            code: 200,
            headers: {},
            body: {}
        }
        request.on('response', (response) => {
            resp.code = response.statusCode
            resp.headers = JSON.stringify(response.headers)
            response.on('data', (chunk) => {
                try {
                    resp.body = JSON.parse(Buffer.from(chunk).toString())
                } catch (error) {
                    resp.body = Buffer.from(chunk).toString()
                }
            })  
            response.on('error',(e)=>{
                console.log('response error',e);
                reject(e)
            })
            response.on('end', () => {
                if(resp.code === 200){
                    resolve(resp.body)
                }else{
                    reject(resp.body)
                }
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