<template>
  <div id="password">
    <div class="password-box">
      <p class="password-title">密码重置</p>
      <div class="password-input-box">
        <span class="password-text">旧密码：</span><el-input class="input-password" placeholder="请输入旧密码" v-model="password" show-password clearable></el-input><br>
        <span class="password-text">新密码：</span><el-input class="input-password" placeholder="请输入密码" v-model="newPassword" show-password clearable></el-input>
        <span class="password-text">确认密码：</span><el-input class="input-password" placeholder="请再次确认密码" v-model="passwordAgain" show-password clearable></el-input>
      </div>
      <div class="btn-box">
        <el-button type="primary" class="btn-sure" @click="resetPassword">确认修改</el-button>
        <el-button type="danger" @click="clear">取消修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {setPasswordApi} from "../../http/api"
export default {
    name:"Password",
    data() {
        return {
            password:"",
            newPassword:"",
            passwordAgain:""
        }
    },
    methods: {
        async resetPassword(){
          if(!this.password||!this.newPassword||!this.passwordAgain) return this.$message.warning({
                                                                      message:"请将信息填写完整！",
                                                                      duration:"2000",
                                                                      offset:110,
                                                                      showClose:true
                                                                    })
          if(this.newPassword!=this.passwordAgain) return this.$message.warning({
                                                    message:"新密码不一致！",
                                                    duration:"2000",
                                                    offset:110,
                                                    showClose:true
                                                  })
          if(this.newPassword==this.password) return this.$message.warning({
                                                    message:"新密码与旧密码重复！",
                                                    duration:"2000",
                                                    offset:110,
                                                    showClose:true
                                                  })
          const params={
            password:this.password,
            newPassword:this.newPassword,
            account:this.$store.state.userInfo.account
          }
          const res =await setPasswordApi(params)
          if(res.data.code==1){
            this.clear()
            this.$message.success({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
          }else{
            this.clear()
            this.$message.error({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
          }
        },
        clear(){
          this.password=""
          this.newPassword=""
          this,this.passwordAgain=""
        }
    },
    created() {
        
    },
}
</script>

<style scoped>
  #password{
    display: flex;
    justify-content: center;
  }
  .password-box{
    margin-top: 50px;
    width: 60%;
    padding: 20px;
    border-radius: 15px;
    box-shadow:1px 1px 2px 1px rgba(0, 0, 0, 0.2) ;
  }
  .password-title{
    color: #303133;
    font-weight: bold;
  }
  .password-text{
    font-size: 14px;
    color: #606266;
  }
  .input-password{
    width: 250px !important;
    margin-top: 20px;
    margin-right: 10px;
  }
  .btn-box{
    margin-top: 20px;
  }
</style>