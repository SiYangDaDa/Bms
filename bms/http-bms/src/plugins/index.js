// 该文件主要用于集中管理element ui组件
import {Button,Input,Menu,MenuItem,Submenu,Dialog,Descriptions,DescriptionsItem,Tag,TabPane,Tabs,Pagination,Option,Select,Tooltip,Switch} from 'element-ui'
let plugins=[Button,Input,Menu,MenuItem,Submenu,Dialog,Descriptions,DescriptionsItem,Tag,TabPane,Tabs,Pagination,Option,Select,Tooltip,Switch]
export default function getElePlugin(Vue){
    plugins.forEach((item)=>{
        return Vue.use(item)
    })
}