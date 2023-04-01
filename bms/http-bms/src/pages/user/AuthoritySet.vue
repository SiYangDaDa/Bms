<template>
  <div id="authoritySet">
    <el-tabs type="border-card" :style="'height:'+height" @tab-click="changeTab">
      <el-tab-pane label="超管权限">
        <p class="little-title">功能权限</p>
        <AuthoritySwitch v-if="tabNum==0" :type="0"></AuthoritySwitch>
      </el-tab-pane>
      <el-tab-pane label="管理员权限">
        <div class="authority-box" v-resize="getAuthorityBoxHeight">
          <p class="little-title">功能权限</p>
          <AuthoritySwitch v-if="tabNum==1" :type="1"></AuthoritySwitch>
        </div>
        <div class="accountAuthority-box">
          <p class="little-title">账户权限</p>
          <Search style="margin:10px 0 0 10px" type="adminAuthority" passData="passUserInfo"></Search>
            <div class="table" v-show="searchResult.length>0" :style="'height:'+searchResultHeight">
              <div class="table-title">
                <div>账户</div>
                <div>姓名</div>
                <div>联系方式</div>
                <div>账户密码</div>
                <div>账户禁用</div>
                <div>操作</div>
              </div>
              <div class="table-content" v-for="item in searchResult" :key="item.Id">                
                <div class="table-content-item">{{item.UserId}}</div>
                <div class="table-content-item" @click="resetUserInfo(item)">{{item.UserName}}</div>
                <div class="table-content-item" @click="resetUserInfo(item)">{{item.Phone}}</div>
                <div class="table-content-item" @click="resetUserInfo(item)">{{item.Password}}</div>
                <div class="table-content-item" @click="resetUserInfo(item)">{{item.Status==1?'否':'是'}}<span></span></div>
                <div class="table-content-item lats-item">删除</div>
              </div>
            </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="其他用户权限">
        <div class="authority-box">
          <p class="little-title">功能权限</p>
          <AuthoritySwitch v-if="tabNum==2" :type="2"></AuthoritySwitch>
        </div>
        <div class="accountAuthority-box">
          <p class="little-title">账户权限</p>
          <Search style="margin:10px 0 0 10px" type="otherUsersAuthority" passData="passUserInfo"></Search>
          <div class="table" v-show="searchResult.length>0" :style="'height:'+searchResultHeight">
              <div class="table-title">
                <div style="width:10vw">账户</div>
                <div style="width:10vw">姓名</div>
                <div style="width:10vw">联系方式</div>
                <div style="width:10vw">账户密码</div>
                <div style="width:10vw">借阅权限</div>
                <div style="width:10vw">逾期次数</div>
                <div style="width:10vw">逾期天数</div>
                <div style="width:10vw">账户禁用</div>
                <div style="width:10vw">操作</div>
              </div>
              <div class="table-content" v-for="item in searchResult" :key="item.Id">                
                <div style="width:10vw" class="table-content-item">{{item.UserId}}</div>
                <div style="width:10vw" class="table-content-item">{{item.UserName}}</div>
                <div style="width:10vw" class="table-content-item">{{item.Phone}}</div>
                <div style="width:10vw" class="table-content-item" @click="resetUserInfo(item)">{{item.Password}}</div>
                <div style="width:10vw" class="table-content-item" @click="resetUserInfo(item)">{{item.Borrow==1?'可用':'禁用'}}</div>
                <div style="width:10vw" class="table-content-item">{{item.OverdueNum}}</div>
                <div style="width:10vw" class="table-content-item">{{item.OverdueSumDays}}</div>
                <div style="width:10vw" class="table-content-item"  @click="resetUserInfo(item)">{{item.Status==1?'否':'是'}}<span></span></div>
                <div style="width:10vw" class="table-content-item lats-item">删除</div>
              </div>
            </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <PopUpLayer :isShow="isShow" :closePopUpLayer="close" title="账户信息">
      <div class="pop-item"><span>账户:</span><span>{{userInfo.UserId}}</span></div>
      <div class="pop-item">
        <span>姓名:</span>
        <span>
          <el-input
            class="pop-input"
            placeholder="请输入姓名"
            v-model="userInfo.UserName"
            clearable>
          </el-input>
        </span>
      </div>
      <div class="pop-item">
        <span>电话:</span>
        <span>
          <el-input
            class="pop-input"
            placeholder="请输入电话"
            v-model="userInfo.Phone"
            clearable>
          </el-input>
        </span>
      </div>
      <div class="pop-item">
        <span>密码:</span>
        <span>
          <el-input
            class="pop-input"
            placeholder="请输入密码"
            v-model="userInfo.Password"
            clearable>
          </el-input>
        </span>
      </div>
      <div class="pop-item">
        <span>账户禁用:</span>
        <span>
          <el-switch
            @change="setUserInfo"
            v-model="userInfo.Status"
            :active-value="activeValue"
            :inactive-value="inActiveValue"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </span>
      </div>
      <div class="pop-item">
        <span>借阅权限禁用:</span>
        <span>
          <el-switch
            @change="setUserInfo2"
            v-model="userInfo.Borrow"
            :active-value="activeValue"
            :inactive-value="inActiveValue"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </span>
      </div>
      <div class="pop-item">
        <el-button type="primary" @click="setAccountInfo">修改</el-button>
        <el-button type="danger" @click="close">取消</el-button>
      </div>
    </PopUpLayer>
  </div>
</template>

<script>
import {SetAccountInfpApi} from "../../http/api"
import AuthoritySwitch from "../../components/AuthoritySwitch.vue"
import Search from "../../components/Search.vue"
import PopUpLayer from "../../components/PopUpLayer.vue"
export default {
    name:"AuthoritySet",
    components:{
      AuthoritySwitch,
      Search,
      PopUpLayer
    },
    data() {
      return {
        tabNum:0,
        height:"",
        searchResultHeight:"",
        searchResult:[],
        isShow:false,
        activeValue:0,
        inActiveValue:1,
        userInfo:{},
        params:{}
      }
    },
    methods: {
      changeTab(el){
        this.tabNum=el.index
        this.searchResult=[]
      },
      // 获取页面高度，并计算标签高度
      getHeight(){
        this.height=(window.innerHeight-61)+'px'
        // this.chooseItemHeight=(window.innerHeight-200)+'px'
      },
      getUserInfo(data){
        this.searchResult=data
      },
      close(){
        this.isShow=!this.isShow
        if(this.isShow==false){
          this.userInfo={}
          this.params={}
        }
      },
      resetUserInfo(item){
        this.userInfo=item
        this.close()
      },
      setUserInfo(){
        this.params=this.userInfo
        this.params.type=this.tabNum
      },
      setUserInfo2(){
        if(this.userInfo.Borrow==1){
          this.userInfo.OverdueNum=0
        }
        this.params=this.userInfo
        this.params.type=this.tabNum
      },
      async setAccountInfo(){
        const res=await SetAccountInfpApi(this.params)
        if(res.data.code==1){
          this.searchResult.forEach(ele=>{
            if(ele.Id==this.userInfo.Id){
              ele=this.userInfo
            }
          })
          this.$message.success({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
          this.close()
        }else{
          this.$message.error({
            message:res.data.msg,
            duration:2000,
            offset:110,
            showClose:true
          })
        }
      },
      // 获取元素的高度
      getAuthorityBoxHeight({height}){
        console.log(parseFloat(height))
        this.searchResultHeight=parseFloat(this.height)-parseFloat(height)-39-110
        this.searchResultHeight=this.searchResultHeight+"px"
      }
    },
    created() {
      this.getHeight()
    },
    mounted() {
    // 全局事件总线
     this.$bus.$on("passUserInfo",(data)=>{this.getUserInfo(data)})
    },
    beforeDestroy(){
      // 关闭全局事件总线
      this.$bus.$off("passUserInfo")
    },
}
</script>

<style scoped>
  .little-title{
    color: #303133;
    font-weight: bold;
    margin-left: 10px;
  }
  .authority-box{
    border-bottom: 1px solid rgba(158,159,160,0.5);
    padding-bottom: 10px;
  }
  .accountAuthority-box{
    padding-top: 10px;
  }
  .table{
    overflow-y: scroll;
  }
  .table-title,.table-content{
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
  .table-content{
    margin: 0;
  }
  .table-title>div,.table-content-item{
    color:gray;
    font-size: 14px;
    width: 16vw;
    padding: 5px;
    box-sizing: border-box;
    border-top: 1px solid rgba(158,159,160,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .table-title>div{
    border-top: none;
  }
  .table-content-item:hover{
    cursor: pointer;
    background-color: #EBEEF5;
  }
  .lats-item:hover{
    color:red
  }
  .pop-input{
    width: 250px !important;
  }
  .pop-item{
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #606266;
  }
</style>