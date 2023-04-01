import Vue from 'vue'
import App from './App.vue'
import VueRouter  from 'vue-router'
import router from "./router/router"
import store from "./store/index"
import getElePlugin from './plugins/index'
// Vue自定义指令，获取元素的宽高
import './fun/resize'
// 引入条形码识别相关的字体图标的样式文件
import '@/assets/barCode_iconfont/iconfont.css'

getElePlugin(Vue)

import "element-ui/lib/theme-chalk/index.css"
import {Message} from 'element-ui'

Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus=this
    Vue.prototype.$message = Message
  }
}).$mount('#app')
