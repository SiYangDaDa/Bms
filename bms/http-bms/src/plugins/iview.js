// 该文件主要用于集中管理element ui组件
import {Button} from 'view-design'
let plugins=[Button]
export default function getElePlugins(Vue){
    plugins.forEach((item)=>{
        return Vue.use(item)
    })
}