<template>
  <div id="boosSet">
    <el-tabs type="border-card" :style="'height:'+height">
        <el-tab-pane label="图书上下架">
              <Search passData="getData" type="bookInfo" :onShelve="false"></Search>
              <div class="searchResult-box" :style="'height:'+chooseItemHeight">
                <div class="table" v-show="searchResult.length>0">
                  <div class="table-title">
                    <div>ISBN</div>
                    <div>书名</div>
                    <div>编辑</div>
                    <div>出版社</div>
                    <div>分类</div>
                    <div>价格</div>
                    <div>库存</div>
                    <div>位置</div>
                    <div>操作</div>
                  </div>
                  <div class="table-content" v-for="item in searchResult" :key="item.Id">
                    <el-tooltip class="item" effect="dark" :content="item.BookId.toString()" placement="top">
                      <div class="table-content-item">{{item.BookId}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="item.BookName" placement="top">
                      <div class="table-content-item">{{item.BookName}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="item.Author" placement="top">
                      <div class="table-content-item">{{item.Author}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="item.Press" placement="top">
                      <div class="table-content-item">{{item.Press}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="item.Type" placement="top">
                      <div class="table-content-item">{{item.Type}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="item.Price.toString()" placement="top">
                      <div class="table-content-item" @click="openReset('价格','Price',item.BookId)">{{item.Price}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="item.Stock.toString()" placement="top">
                      <div class="table-content-item" @click="openReset('库存','Stock',item.BookId)">{{item.Stock}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="item.Location" placement="top">
                      <div class="table-content-item" @click="openReset('位置','Location',item.BookId)">{{item.Location}}</div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :disabled="true" placement="top">
                      <div class="table-content-item operate"><span style="margin-right:10px;color:#409EFF" v-if="item.Status=='下架'" @click="setBookStatus('上架',item.BookId)">上架</span><span v-else style="margin-right:10px;color:#409EFF" @click="setBookStatus('下架',item.BookId)">下架</span><span style="color:red">删除</span></div>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <PopUpLayer :isShow="isShow" :closePopUpLayer="closePopUpLayer" title="更改项">
                  <div class="slotTitle">请设置{{resetEle.name}}:</div>
                  <div class="addSlot">
                    <el-input
                      placeholder="请输入内容"
                      v-model="newVal"
                      clearable>
                    </el-input>
                  </div>
                  <div id="btn-box">
                    <el-button type="primary" @click="submit">确定</el-button>
                    <el-button type="danger" @click="closePopUpLayer">取消</el-button>
                  </div>
              </PopUpLayer>
        </el-tab-pane>
        <el-tab-pane label="分类管理" class="type-manage">
            <div class="choose-item">
              <p class="title">分类管理</p>
              <div class="tip" style="margin-bottom:10px">添加分类：</div>
              <el-input class="input-info" placeholder="请输入分类名称" v-model="newType" clearable></el-input>
              <div class="bookType-box">
              <div class="btn-box">
                <el-button type="primary" @click="addBooksType">添加</el-button>
                <el-button type="danger" @click="clear">取消</el-button>
              </div>
              <div class="tip" style="width:100%;margin-top:20px">图书分类：</div>
                <div class="typebox">
                  <span @click="chooseType(item,0)" :class="{'bookType':true,'typeChoosed':chooseTypeList.includes(item)}" v-for="item in typeList" :key="item.Id">{{item.Type}}</span>
                </div>
              </div>
              <div class="btn-box" style="margin-top:20px">
                <el-button type="primary" @click="setTypeStatus(0)">禁用</el-button>
                <el-button type="danger" @click="deletType">删除</el-button>
              </div>
              <div class="tip" style="width:100%;margin-top:20px">禁用分类：</div>
              <div class="typebox">
                  <span @click="chooseType(item,1)" :class="{'bookType':true,'typeChoosed':chooseTypeList2.includes(item)}" v-for="item in forbidenTypeList" :key="item.Id">{{item.Type}}</span>
              </div>
              <div class="btn-box" style="margin-top:20px">
                <el-button type="primary" @click="setTypeStatus(1)">恢复</el-button>
                <el-button type="danger" @click="deletType">删除</el-button>
              </div>
            </div>
        </el-tab-pane>
        
    </el-tabs>
  </div>
</template>

<script>
import {SetBookStatusApi,DeleteBookApi,BooksTypeApi,SetBookPriceApi,SetBookLocationApi,BookForbidenTypeApi,SetBooksTypeStatusApi,DeleteBooksTypeApi,AddBooksTypeApi} from "../../http/api"
import Search from "../../components/Search.vue"
import PopUpLayer from "../../components/PopUpLayer.vue"
export default {
    name:"BooksSet",
    components:{
      Search,
      PopUpLayer
    },
    data() {
      return {
        height:"",
        chooseItemHeight:"",
        searchResult:[],//搜索结果
        isShow:false,//是否显示弹出层
        resetEle:{//需要更改的图书的编号以及字段
          name:null,
          bookId:null,
          key:null
        },
        newVal:null,//新值
        newType:"",//添加的新的图书分类
        typeList:[],//分类数组
        forbidenTypeList:[],//禁用的分类分组
        deleteTypeList:[],//删除的分类分组
        chooseTypeList:[],//选中分类的数组
        chooseTypeList2:[],//选中分类的数组
      }
    },
    methods: {
        // 获取页面高度，并计算标签高度
        getHeight(){
            this.height=(window.innerHeight-61)+'px'
            this.chooseItemHeight=(window.innerHeight-200)+'px'
        },
        // 接收全局事件总线传递过来的搜索结果
        getBookInfo(arr){
          this.searchResult=arr
        },
        // 设置图书状态（上架/下架）
        async setBookStatus(type,num){
          const params={
            status:type,
            bookNum:num
          }
          const res=await SetBookStatusApi(params)
          if(res.data.code==1){
            this.$message.success({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
            this.searchResult.forEach((ele)=>{
              if(ele.BookId==num){
                ele.Status=type
              }
            })
          }else{
            this.$message.error({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
          }
        },
        // 删除图书
        async deleteBook(num){
          const params={
            booNum:num
          }
          const res=await DeleteBookApi(params)
          if(res.data.code==1){
            this.$message.success({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
            this.searchResult=this.searchResult.filter(ele=>ele.BookId!=num)
          }else{
            this.$message.error({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
          }
        },
        // 关闭弹出层
        closePopUpLayer(){
          this.isShow=false
        },
        // 打开弹出层并接收相应的数据
        openReset(val,key,id){
          this.isShow=true
          this.resetEle.name=val
          this.resetEle.bookId=id
          this.resetEle.key=key
        },
        // 提交弹出层修改的信息
        async submit(){
          if(!this.newVal) return this.$message.warning({
                            message:"值不能为空！",
                            duration:"2000",
                            offset:110,
                            showClose:true
                          })
          var res 
          var params
          if(this.resetEle.key=="Price"){
            params={bookNum:this.resetEle.bookId,price:this.newVal}
            res=await SetBookPriceApi(params)
          }else if(this.resetEle.key=="Stock"){
            params={bookNum:this.resetEle.bookId,price:this.newVal}
            console.log(2)
          }else if(this.resetEle.key=="Location"){
            params={bookNum:this.resetEle.bookId,location:this.newVal}
            res=await SetBookLocationApi(params)
          }
          if(res.data.code==1){
            // 修改页面上显示的数据
            this.searchResult.forEach((ele)=>{
              if(ele.BookId==this.resetEle.bookId){
                ele[this.resetEle.key]=this.newVal
              }
            })
            this.newVal=""
            this.closePopUpLayer()
            this.$message.success({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
          }else{
            this.$message.error({
              message:res.data.msg,
              duration:"2000",
              offset:110,
              showClose:true
            })
          }
        },
        // 获取图书可用分类
        async getBooksType(){
            const res=await BooksTypeApi()
            if(res.data.code==1){
              this.typeList=res.data.data
            }else{
              this.$message.error({
                message:res.data.msg,
                duration:2000,
                offset:110,
                showClose:true
              })
            }
        },
        // 选中图书分类
        chooseType(type,num){
            if(num==0){
              if(this.chooseTypeList.includes(type)){
                this.chooseTypeList=this.chooseTypeList.filter((ele)=> ele!=type)
              }else{
                  this.chooseTypeList.push(type)
              }
            }else if(num==1){
              if(this.chooseTypeList2.includes(type)){
                this.chooseTypeList2=this.chooseTypeList2.filter((ele)=> ele!=type)
              }else{
                  this.chooseTypeList2.push(type)
              }
            }
            if(this.deleteTypeList.includes(type)){
              this.deleteTypeList=this.deleteTypeList.filter((ele)=> ele!=type)
            }else{
              this.deleteTypeList.push(type)
            }
        },
        // 获取图书禁用分类
        async getForbidenType(){
          const res=await BookForbidenTypeApi()
          if(res.data.code==1){
            this.forbidenTypeList=res.data.data
          }else{
            this.$message.error({
              message:res.data.msg,
              duration:2000,
              offset:110,
              showClose:true
            })
          }
        },
        // 设置图书分类的状态
        async setTypeStatus(num){
          var arr=[]
          var params={}
          if(num==0){
            if(this.chooseTypeList.length==0) return this.$message.warning({
                                                message:"请先选择要操作的分类！",
                                                duration:2000,
                                                offset:110,
                                                showClose:true
                                              })
            this.chooseTypeList.forEach((ele)=>{
              arr.push(ele.Id)
            })
            params={
              status:"禁用",
              typeList:arr
            }
          }else if(num==1){
            if(this.chooseTypeList2.length==0) return this.$message.warning({
                                                message:"请先选择要操作的分类！",
                                                duration:2000,
                                                offset:110,
                                                showClose:true
                                              })
            this.chooseTypeList2.forEach((ele)=>{
              arr.push(ele.Id)
            })
            params={
              status:"启用",
              typeList:arr
            }
          }
          const res=await SetBooksTypeStatusApi(params)
          if(res.data.code==1){
            this.changeArr(num)
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
        // 将改变状态后的分类添加到相应的分组并清空选中分组
        changeArr(num){
          if(num==0){
            this.chooseTypeList.forEach((ele)=>{
              this.forbidenTypeList.push(ele)
              this.typeList=this.typeList.filter((item)=>item!=ele)
              this.deleteTypeList=this.deleteTypeList.filter((item)=>item!=ele)
            })
            this.chooseTypeList=[]
          }else if(num==1){
            this.chooseTypeList2.forEach((ele)=>{
              this.typeList.push(ele)
              this.forbidenTypeList=this.forbidenTypeList.filter((item)=>item!=ele)
              this.deleteTypeList=this.deleteTypeList.filter((item)=>item!=ele)
            })
            this.chooseTypeList2=[]
          }else if(num==2){
            this.deleteTypeList.forEach((ele)=>{
              this.forbidenTypeList=this.forbidenTypeList.filter((item)=>item!=ele)
              this.typeList=this.typeList.filter((item)=>item!=ele)
              this.chooseTypeList=this.chooseTypeList.filter((item)=>item!=ele)
              this.chooseTypeList2=this.chooseTypeList2.filter((item)=>item!=ele)
            })
            this.deleteTypeList=[]
          }
        },
        // 删除选中的图书分类
        async deletType(){
          console.log(this.deleteTypeList)
          if(this.deleteTypeList.length==0) return this.$message.error({
                                              message:"请先选择要操作的分类！",
                                              duration:2000,
                                              offset:110,
                                              showClose:true,
                                            })
          var arr=[]
          this.deleteTypeList.forEach(ele=>{
            arr.push(ele.Id)
          })
          const params={
            typeList:arr
          }
          const res=await DeleteBooksTypeApi(params)
          if(res.data.code==1){
            this.changeArr(2)
            this.$message.success({
              message:res.data.msg,
              duration:2000,
              offset:110,
              showClose:true,
            })
            this.deleteTypeList=[]
          }else{
            this.$message.error({
              message:res.data.msg,
              duration:2000,
              offset:110,
              showClose:true,
            })
          }
        },
        // 添加图书分类
        async addBooksType(){
          if(!this.newType) return this.$message.warning({
                              message:"输入不能为空！",
                              duration:2000,
                              offset:110,
                              showClose:true
                            })
          const params={
            newType:this.newType
          }
          const res=await AddBooksTypeApi(params)
          if(res.data.code==1){
            this.clear()
            this.typeList=res.data.data
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
        // 清空输入框
        clear(){
          this.newType=""
        }
    },
    created() {
      this.getHeight()
      this.getBooksType()
      this.getForbidenType()
    },
    mounted() {
    // 全局事件总线
     this.$bus.$on("getData",(data)=>{this.getBookInfo(data)})
    },
    beforeDestroy(){
      // 关闭全局事件总线
      this.$bus.$off("getData")
    },
}
</script>

<style scoped>
  .type-manage{
    display: flex;
    justify-content: center;
  }
  .choose-item{
    width: 80%;
    padding: 20px;
    border-radius: 15px;
    box-shadow:1px 1px 2px 1px rgba(0, 0, 0, 0.2) ;
  }
  .pages-box{
    position: fixed;
    bottom: 10px;
    right:0;
  }
  .table-title,.table-content{
    display: flex;
    justify-content: center;
  }
  .table-title>div,.table-content>.item{
    width: 10vw;
    text-align: center;
    line-height: 40px;
    height: 40px;
    overflow: hidden;
  }
  .table-content-item{
    color:gray;
    font-size: 14px;
    width: 10vw;
    padding: 0 5px;
    box-sizing: border-box;
    border-top: 1px solid rgba(158,159,160,0.5);
  }
  .table-content-item:hover{
    cursor: pointer;
    background-color: #EBEEF5;
  }
  .slotTitle{
    font-size: 14px;
    color: #606266;
  }
  .addSlot{
    margin-bottom: 30px;
  }
  .bookType-box{
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .input-info{
    width:250px !important
  }
  .bookType{
    padding: 2px;
    border-radius: 5px;
    border: 1px solid #cdcdcd;
    font-size: 14px;
    color: #cdcdcd;
    margin-right: 10px;
    margin-top: 10px;
  }
  .bookType:hover{
    cursor: pointer;
  }
  .typebox{
    display: flex;
    flex-wrap: wrap;
  }
  .typeChoosed{
    border-color: #409EFF;
    color: #409EFF;
  }
  .title{
    color: #303133;
    font-weight: bold;
    margin-right: 20px;
    margin-bottom: 10px;
  }
  .tip{
    font-size: 14px;
    color: #606266;
  }
</style>