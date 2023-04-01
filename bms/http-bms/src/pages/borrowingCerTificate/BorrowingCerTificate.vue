<template>
  <div id="borrowingCerTificate">
    <div class="borrowCertificate-box">
        <p class="title">借阅证办理</p>
        <span class="bc-text">学号：</span><el-input class="input-password" placeholder="请输入学号" v-model="account" clearable></el-input>
        <span class="bc-text">姓名：</span><el-input class="input-password" placeholder="请输入姓名" v-model="name" clearable></el-input><br>
        <span class="bc-text">电话：</span><el-input class="input-password" placeholder="请输入联系方式" v-model="phone" clearable></el-input>
        <div class="btn-box">
            <el-button type="primary" class="btn-sure" @click="regist">确认办理</el-button>
            <el-button type="danger" @click="clear">取消办理</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import {registApi} from "../../http/api"
export default {
    name:"BorrowingCerTificate",
    data() {
        return {
            account:"",
            name:"",
            phone:""
        }
    },
    methods: {
        clear(){
            this.account=""
            this.userName=""
            this.phone=""
        },
        async regist(){
            if(!this.account||!this.name||!this.phone) return this.$message.warning({
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
            const params={
                account:this.account,
                name:this.name,
                phone:this.phone,
                password:123456,
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
    #borrowingCerTificate{
        display: flex;
        justify-content: center;
    }
    .borrowCertificate-box{
        margin-top: 50px;
        width: 60%;
        padding: 20px;
        border-radius: 15px;
        box-shadow:1px 1px 2px 1px rgba(0, 0, 0, 0.2) ;
    }
    .title{
        color: #303133;
        font-weight: bold;
    }
    .input-password{
        width: 250px;
        margin-top: 20px;
        margin-right: 10px;
    }
    .bc-text{
        font-size: 14px;
        color: #606266;
    }
    .btn-box{
        margin-top: 20px;
    }
</style>