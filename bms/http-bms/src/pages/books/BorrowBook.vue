<template>
  <div id="borrowBook">
    <div class="borrowBook-box">
      <div>
        <div>
          <p class="title">图书借阅</p>
          <Quagga :getCode="getCode"></Quagga>
          <BarCode style="margin-left:10px" :showVideo="showVideo" :setVideoShow="setVideoShow"></BarCode>
        </div>
        <div>
          <span class="tips">ISBN：</span><el-input class="input-info" placeholder="请输入图书编号" v-model="ISBN" clearable></el-input>
        </div>
        <div>
          <span class="tips">学号：</span><el-input class="input-info" placeholder="请输入学号" v-model="studentId" clearable></el-input>
        </div>
        <div>
          <span class="tips">天数：</span><el-input class="input-info" placeholder="请输入借阅天数" v-model.number="days" clearable></el-input>
        </div>
        <div class="btn">
          <el-button type="primary" @click="borrowBook">借阅</el-button>
          <el-button type="danger" @click="clear">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getBookInfoByCode} from "../../fun/getBookInfo"
import {BorrowBookApi} from "../../http/api"
import Quagga from "../../components/Quagga.vue"
import BarCode from "../../components/BarCode.vue"
export default {
    name:"BorrowBook",
    components:{
      Quagga,
      BarCode
    },
    data() {
      return {
        ISBN:"",
        studentId:"",
        days:null,
        showVideo:false
      }
    },
    methods: {
      // 获取路由传递过来的ISBN
      getISBN(){
        if(this.$route.params) this.ISBN=this.$route.params.bookId
        return
      },
      // 格式化借书日期，并根据借书日期、借书天数格式化还书日期
      getDate(){
        var date=new Date()
        var borrowDate=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
        var d=new Date(borrowDate)
        d.setDate(d.getDate()+this.days)
        var m=d.getMonth()+1 
        var returnDate=d.getFullYear()+'-'+m+'-'+d.getDate()
        return {borrowDate,returnDate}
      },
      // 借书
      async borrowBook(){
        if(!this.ISBN||!this.studentId||!this.days) return this.$message.warning({
                                                      message:"请将信息填写完整！",
                                                      duration:2000,
                                                      offset:110,
                                                      showClose:true
                                                    })
        var date=this.getDate()
        const params={
          bookId:this.ISBN,
          studentId:this.studentId,
          borrowDate:date.borrowDate,
          returnDate:date.returnDate,
          days:this.days
        }
        const res=await BorrowBookApi(params)
        if(res.data.code==1){
          this.clear()
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
      // 清空输入框内容
      clear(){
        this.ISBN=""
        this.studentId=""
        this.days=null
      },
      // 获取扫描图片得到的编号
      async getCode(code){
        this.ISBN=code
        await getBookInfoByCode(code)
      },
      setVideoShow(){
        this.showVideo=!this.showVideo
      }
    },
    created() {
      this.getISBN()
    },
}
</script>

<style scoped>
  #borrowBook{
    display: flex;
    justify-content: center;
  }
  .borrowBook-box{
    /* width: 60%; */
    margin-top: 50px;
    padding: 20px;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    box-shadow:1px 1px 2px 1px rgba(0, 0, 0, 0.2) ;
  }
  .title{
    color: #303133;
    font-weight: bold;
    margin-right: 20px;
  }
  .borrowBook-box>div>div{
    display: flex;
    margin-bottom: 20px;
    align-items: center;
  }
  .tips{
    width: 60px;
  }
  .input-info{
    width: 250px !important;
  }
</style>