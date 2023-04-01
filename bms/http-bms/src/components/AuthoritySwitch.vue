<template>
<!-- 该组件为权限开关 -->
  <div id="switch">
    <div class="switch-box-box">
      <div v-for="(item,idx) in authorityList" :key="item.Id" class="switch-box">
        <span class="authorityName">{{item.Name}}</span>
        <el-switch
            @change="setAuthority(idx,item.Id)"
            v-model="item.Type"
            :active-value="activeValue"
            :inactive-value="inActiveValue"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </div>
    </div>
    <div style="padding-left:10px">
      <el-button type="primary" @click="resetAuthority">重置</el-button>
    </div>
  </div>
</template>

<script>
import {GetAuthorityApi,SetAuthorityApi,ResetAuthorityApi} from "../http/api"
export default {
    name:"AuthoritySwitch",
    props:["type"],
    data() {
        return {
            activeValue:1,
            inActiveValue:0,
            authorityList:[]
        }
    },
    methods: {
      // 获取不同账户的功能权限
      async getAuthority(num){
        var params={
          type:num
        }
        const res=await GetAuthorityApi(params)
        if(res.data.code==1){
          this.authorityList=res.data.data
        }else{
          this.$message.error({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
        }
      },
      // 修改功能权限
      async setAuthority(index,Id){
        const params={
          type:this.type,
          id:Id,
          value:this.authorityList[index].Type
        }
        const res=await SetAuthorityApi(params)
        if(res.data.code==1){
          this.$message.success({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
        }else{
          this.$message.error({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
        }
      },
      // 重置功能权限
      async resetAuthority(){
        const params={type:this.type}
        const res=await ResetAuthorityApi(params)
        if(res.data.code==1){
          this.authorityList=res.data.data
          this.$message.success({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
        }else{
          this.$message.error({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
        }
      }
    },
    created() {
      this.getAuthority(this.type)
    },
}
</script>

<style scoped>
  
  .switch-box-box{
    display: flex;
    flex-wrap: wrap;
  }
  .switch-box{
    width: 200px;
    display: flex;
    justify-content: space-between;
    margin-right: 50px;
    padding: 10px;
  }
  .switch-box:hover{
    background-color: rgba(158,159,160,0.5);
    border-radius: 5px;
    color: #409EFF;
    cursor: pointer;
  }
  .authorityName{
    width:150px
  }
</style>