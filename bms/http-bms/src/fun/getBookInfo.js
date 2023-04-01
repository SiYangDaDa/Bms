// 该方法主要用于接收图书的ISBN号，并返回该图书的具体信息
import axios from 'axios'
export const getBookInfoByCode=function(code){
    return new Promise((result, reject) =>{
        const url="https://api.jike.xyz/situ/book/isbn/"+code+"?apikey=14588.65be6863702300b89c37a6f2b0ae9e79.3c5c53c895535db40f2e20db16fec4df"
        axios.get(url).then((res)=>{
            result(res.data)
        }).catch((err)=>{
            reject(err)
        })
    })
    
}
