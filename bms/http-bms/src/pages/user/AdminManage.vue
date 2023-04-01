<template>
  <div id="adminManage">
    <div class="adminManage-box">
        <p class="title">管理员添加</p>
        <div>
            <span>账户：</span>
            <el-input class="input-info" placeholder="请输入工号" v-model="account" clearable></el-input>
        </div>
        <div>
            <span>姓名：</span>
            <el-input class="input-info" placeholder="请输入姓名" v-model="name" clearable></el-input>
        </div>
        <div>
            <span>电话：</span>
            <el-input class="input-info" placeholder="请输入电话" v-model="phone" clearable></el-input>
        </div>
        <div class="btn-box">
            <el-button type="primary" class="btn-sure" @click="addManage">创建</el-button>
            <el-button type="danger" @click="clear">取消</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import {AddAdminApi} from "../../http/api"
export default {
    name:"AdminManage",
    data() {
        return {
            phone:"",
            name:"",
            account:"",
        }
    },
    methods: {
        // 判断手机号是否合法
        checkNum() {
            const reg =/^1(3|4|5|6|7|8|9)\d{9}$/
            if (!reg.test(this.phone)) {
                return false
            }else{
                return true
            }
        },
        async addManage(){
            if(!this.phone||!this.name||!this.account) return this.$message.warning({
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
                phone:this.phone
            }
            const res=await AddAdminApi(params)
            if(res.data.code==1){
                this.$message.success({
                    message:res.data.msg,
                    duration:2000,
                    offset:110,
                    showClose:true
                })
                this.clear()
            }else{
                this.$message.error({
                    message:res.data.msg,
                    duration:2000,
                    offset:110,
                    showClose:true
                })
                this.clear()
            }
        },
        clear(){
            this.phone=""
            this.name=""
            this.account=""
        }
    },
}
</script>

<style scoped>
    #adminManage{
        display: flex;
        /* justify-content: center; */
        flex-direction: column;
        align-items: center;
    }
    .adminManage-box{
        width: 60%;
        padding: 20px;
        border-radius: 15px;
        box-shadow:1px 1px 2px 1px rgba(0, 0, 0, 0.2) ;
        margin-top: 50px;
    }
    .title{
        color: #303133;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .input-info{
        width: 250px !important;
        margin-bottom: 10px;
    }
</style>