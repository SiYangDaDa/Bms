import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const actions={

}
const mutations={
    setUserInfo(state){
        state.userInfo.account=sessionStorage.getItem('account')
        state.userInfo.token=sessionStorage.getItem('token')
        state.userInfo.type=sessionStorage.getItem('type')
        state.userInfo.phone=sessionStorage.getItem('phone')
        state.userInfo.userName=sessionStorage.getItem('userName')
        state.isLogin=true
    },
    logout(state){
        state.userInfo.type=""
        state.userInfo.account=""
        state.userInfo.userName=""
        state.userInfo.phone=""
        state.userInfo.token=""
        state.userInfo.isLogin=false
        state.userInfo.authority=[]
    },
    resetUserInfo(state,arr){
        if(arr.length==1){
            state.userInfo.phone=arr[0]
        }else if(arr.length==2){
            state.userInfo.phone=arr[0]
            state.userInfo.userName=arr[1]
        }
    },
    getAuthority(state,obj){
        state.userInfo.authority=obj
    },
}

const state={
    userInfo:{
        type:"",
        account:"",
        userName:"",
        phone:"",
        isLogin:false,
        token:"",
        authority:{}
    },
    height:0
}

export default new Vuex.Store({
    actions,
    mutations,
    state
})