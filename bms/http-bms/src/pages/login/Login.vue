<template>
  <div id="login">
    <div class="login-item" v-if="show">
        <p class="login-title">图书管理系统</p>
        <div>
            <el-input
                class="login-input"
                placeholder="请输入账户"
                v-model="account"
                clearable>
            </el-input>
        </div>
        <div>
            <el-input
                class="login-input"
                placeholder="请输入密码"
                v-model="password"
                show-password
                clearable>
            </el-input>
        </div>
        <div>
            <el-button class="login-btn" type="primary" @click="login">登录</el-button>
        </div>
        <div>
            <el-button class="login-btn" type="success" @click="change">前往注册</el-button>
        </div>
    </div>
    <div class="login-item" v-if="!show">
        <p class="login-title">图书管理系统</p>
        <div>
            <el-input
                class="login-input"
                placeholder="请输入学号"
                v-model="account"
                clearable>
            </el-input>
        </div>
        <div>
            <el-input
                class="login-input"
                placeholder="请输入姓名"
                v-model="name"
                clearable>
            </el-input>
        </div>
        <div>
            <el-input
                class="login-input"
                placeholder="请输入11位的联系方式"
                v-model="phone"
                validate-event
                clearable>
            </el-input>
        </div>
        <div>
            <el-input
                class="login-input"
                placeholder="请输入密码"
                v-model="password"
                show-password
                clearable>
            </el-input>
        </div>
        <div>
            <el-input
                class="login-input"
                placeholder="请再次确认密码"
                v-model="passwordAgain"
                show-password
                clearable>
            </el-input>
        </div>
        <div>
            <el-button class="login-btn" type="primary" @click="regist">注册</el-button>
        </div>
        <div>
            <el-button class="login-btn" type="success" @click="change">前往登录</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import {loginApi,registApi} from "../../http/api"
export default {
    name:"Login",
    data() {
        return {
            account:"",
            password:"",
            passwordAgain:"",
            name:"",
            phone:"",
            show:true,//用于切换登录和注册模块
        }
    },
    methods: {
        // 切换登录和注册
        change(){
            this.show=!this.show
            this.clear()
        },
        // 登录
        async login(){
            if(!this.password||!this.account) return this.$message.warning({
                                                message:"请将信息填写完整！",
                                                duration:"2000",
                                                offset:110,
                                                showClose:true
                                              })
            const params={
                account:this.account,
                password:this.password
            }
            const res=await loginApi(params)
            if(res.data.code==1){
                this.$message.success({
                    message:"登陆成功！",
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
                sessionStorage.setItem('token',res.data.token)
                sessionStorage.setItem('account',res.data.data[0].UserId)
                sessionStorage.setItem('userName',res.data.data[0].UserName)
                sessionStorage.setItem('phone',res.data.data[0].Phone)
                sessionStorage.setItem('type',res.data.data[0].Type)
                this.$store.commit('setUserInfo')
                this.$router.push({name:"userInfo"})
            }else{
                return this.$message.error({
                    message:res.data.msg,
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
            }
            this.clear()
        },
        // 注册
        async regist(){
            if(!this.password||!this.account||!this.name||!this.phone||!this.passwordAgain) return this.$message.warning({
                                                message:"请将信息填写完整！",
                                                duration:"2000",
                                                offset:110,
                                                showClose:true
                                              })
            if(!this.checkNum()) return this.$message.warning({
                                    message:"请输入合法的手机号！",
                                    duration:"2000",
                                    offset:110,
                                    showClose:true
                                })
            if(this.password!=this.passwordAgain) return this.$message.warning({
                                                    message:"密码不一致！",
                                                    duration:"2000",
                                                    offset:110,
                                                    showClose:true
                                                  })
            const params={
                account:this.account,
                name:this.name,
                phone:this.phone,
                password:this.password,
                type:2
            }
            const res=await registApi(params)
            if(res.data.code==1){
                this.$message.success({
                    message:"注册成功！",
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
                this.clear()
                this.change()
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:"2000",
                    offset:110,
                    showClose:true
                })
                this.clear()
            }
        },
        clear(){
            this.account=""
            this.phone=""
            this.password=""
            this.passwordAgain=""
            this.name=""
        },
        // 判断手机号是否合法
        checkNum() {
            const reg =/^1(3|4|5|6|7|8|9)\d{9}$/
            if (!reg.test(this.phone)) {
                return false
            }else{
                return true
            }
        }
    },
}
</script>

<style scoped>
    #login{
        width: 100%;
        height: 100%;
        background-image: url("../../assets/img/cover1.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .login-title{
        font-size: 30px;
        color: gray;
        letter-spacing:20px;
        text-align: center;
        padding-left: 20px;
        box-sizing: border-box;
    }
    .login-item{
        backdrop-filter: blur(5px);
        background-color:rgba(255,255,255,0.5);
        box-shadow:2px 2px 2px 1px rgba(0, 0, 0, 0.2) ;
        padding:20px 50px 30px 50px;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .login-input{
        margin: 0 !important;
    }
    .login-item div{
        width: 300px;
        margin-top: 15px;
    }
    .login-btn{
        width: 300px !important;
    }
</style>