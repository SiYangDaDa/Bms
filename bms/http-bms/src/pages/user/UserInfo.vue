<template>
  <div id="userInfo">
    <div class="userInfo-box">
      <el-descriptions title="个人信息">
        <el-descriptions-item label="账号"><span>{{$store.state.userInfo.account}}</span></el-descriptions-item>
        <el-descriptions-item label="姓名"><span>{{$store.state.userInfo.userName}}</span></el-descriptions-item>
        <el-descriptions-item label="备注">
        <el-tag size="small">{{remark}}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div class="phone-box">
        <span>手机号：</span>
          <span v-show="!isShow">{{$store.state.userInfo.phone}}</span>
          <el-input v-show="isShow" class="input-phone" placeholder="请输入内容" v-model="newPhone" clearable></el-input>
        </div>
      <div class="btn-box">
        <el-button v-show="!isShow" type="primary" @click="isShowInput">点击修改</el-button>
        <el-button v-show="isShow" type="primary" class="btn-sure" @click="setUserInfo">确认修改</el-button>
        <el-button v-show="isShow" type="danger" @click="isShowInput">取消修改</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import {setUserInfoApi} from "../../http/api"
export default {
    name:"UserInfo",
    data() {
        return {
            isShow:false,
            newPhone:"",
            remark:""
        }
    },
    watch:{
      '$store.state.userInfo':{
        immediate:true,
        deep:true,
        handler(){
          if(this.$store.state.userInfo.type=="0"){
            this.remark="超管"
          }else if(this.$store.state.userInfo.type=="1"){
            this.remark="管理员"
          }else if(this.$store.state.userInfo.type=="2"){
            this.remark="学生"
          }
        }
      }
    },
    methods: {
      // 显示与隐藏输入框，并清空输入框
        isShowInput(){
          this.isShow=!this.isShow
          this.newPhone=""
        },
        // 修改个人信息
        async setUserInfo(){
          // 判断手机号是否合法
          if(!this.newPhone||!this.checkNum()) return this.$message.warning({
            message:"请输入合法的联系方式！",
            duration:"2000",
            offset:110,
            showClose:true
          })
          // 配置请求参数
          const params={
            type:0,
            account:this.$store.state.userInfo.account,
            phone:this.newPhone
          }
          // 发起请求
          const res=await setUserInfoApi(params)
          // 判断请求结果
          if(res.data.code==1){
            this.$store.commit("resetUserInfo",[this.newPhone])
            sessionStorage.setItem('phone',this.newPhone)
            this.isShowInput()
            this.$message.success({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
          }else{
            return this.$message.error({
              message:res.data.error,
              duration:2000,
              offset:110,
              showClose:true
            })
          }
        },
        // 判断手机号是否合法
        checkNum() {
            const reg =/^1(3|4|5|6|7|8|9)\d{9}$/
            if (!reg.test(this.newPhone)) {
                return false
            }else{
                return true
            }
        }
    },
    created() {
      
    },
}
</script>

<style scoped>
  #userInfo{
    display: flex;
    justify-content: center;
  }
  .userInfo-box{
    width: 60%;
    margin-top: 50px;
    box-shadow:1px 1px 2px 1px rgba(0, 0, 0, 0.2) ;
    padding: 20px;
    border-radius: 15px;
  }
  .phone-box{
    font-size: 14px;
    color: #606266;
    height: 40px;
    line-height: 40px;
  }
  .input-phone{
    width: 250px !important;
  }
  .btn-box{
    margin-top: 20px;
  }
  .btn-sure{
    margin: 0 !important;
  }
</style>