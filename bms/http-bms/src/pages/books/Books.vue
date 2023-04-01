<template>
  <div id="books">
    <el-tabs type="border-card" :style="'height:'+height" @tab-click="change">
        <el-tab-pane label="添加新图书" class="choose">
            <div class="add" :style="'height:'+addHeight" @tab-click="change">
                <div class="title-box"><p class="title">添加新图书</p><Quagga :getCode="getCode"></Quagga><BarCode style="margin-left:10px" :showVideo="showVideo" :setVideoShow="setVideoShow"></BarCode></div>
                <span class="tip">图书名称：</span><el-input class="input-info" placeholder="请输入图书名称" v-model="bookName" clearable></el-input>
                <span class="tip">图书编号：</span><el-input class="input-info" placeholder="请输入图书编号" v-model="bookNum" clearable></el-input><br>
                <span class="tip">图书作者：</span><el-input class="input-info" placeholder="请输入作者" v-model="author" clearable></el-input>
                <span class="tip press">出版社：</span><el-input class="input-info" placeholder="请输入出版社" v-model="press" clearable></el-input><br>   
                <span class="tip">图书价格：</span><el-input class="input-info" placeholder="请输入图书价格" v-model="price" clearable></el-input>
                <span class="tip">图书位置：</span><el-input class="input-info" placeholder="请输入图书位置" v-model="position" clearable></el-input><br>
                <span class="tip">添加数量：</span><el-input class="input-info" placeholder="请输入图书数量" v-model.number="num" clearable></el-input>
                <span class="tip">图书封面：</span><el-input class="input-info" placeholder="请输入封面地址" v-model="imgUrl" clearable></el-input><br>
                <div class="bookType-box">
                    <span class="tip">图书分类：</span>
                    <div class="typebox">
                        <span @click="chooseType(item.Type)" :class="{'bookType':true,'typeChoosed':chooseTypeList.includes(item.Type)}" v-for="item in typeList" :key="item.Id">{{item.Type}}</span>
                    </div>
                </div>
                <div class="desc">
                    <span class="tip">图书描述：</span><el-input type="textarea" placeholder="请输入图书描述" class="describe" v-model="desc" ref="describe"></el-input>
                </div>
                <!-- <div class="img-upload-box">
                    <span class="tip">图书封面：</span>
                    <File></File>
                    <el-input class="input-info" placeholder="请输入封面地址" v-model="imgUrl" clearable></el-input><br>
                </div> -->
                <div class="btn-box">
                    <el-button type="primary" class="btn-sure" @click="addBooks">确认添加</el-button>
                    <el-button type="danger" @click="clear">取消添加</el-button>
                </div>
            </div>
        </el-tab-pane>
        <el-tab-pane label="添加库存" class="choose">
            <div class="add">
                <!-- <p class="title">添加图书库存</p> -->
                <div class="title-box"><p class="title">添加图书库存</p><Quagga :getCode="getCode"></Quagga><BarCode style="margin-left:10px" :showVideo="showVideo" :setVideoShow="setVideoShow"></BarCode></div>
                <span class="tip">图书编号：</span><el-input class="input-info" placeholder="请输入图书编号" v-model="bookNum" clearable></el-input>
                <span class="tip">添加数量：</span><el-input class="input-info" placeholder="请输入添加数量" v-model="num" clearable></el-input>
                <div class="btn-box">
                    <el-button type="primary" class="btn-sure" @click="addBookNum">确认添加</el-button>
                    <el-button type="danger" @click="clear">取消添加</el-button>
                </div>
            </div>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getBookInfoByCode} from "../../fun/getBookInfo"
import {BooksTypeApi,AddNewBookApi,AddBookNumApi} from "../../http/api"
// import File from "../../components/File.vue"
import Quagga from "../../components/Quagga.vue"
import BarCode from "../../components/BarCode.vue"
export default {
    name:"Books",
    components:{
        // File,
        Quagga,
        BarCode,
    },
    data() {
        return {
            height:"",
            addHeight:"",
            imgUrl:"",
            desc:"",
            bookName:"",
            bookNum:"",
            author:"",
            press:"",
            price:"",
            position:"",
            num:"",
            typeList:[],
            chooseTypeList:[],
            showVideo:false,
            timer:null
        }
    },
    watch:{
        // '$store.state.fileUrl':{
        //     deep:true,
        //     handler(){
        //         if(this.$store.state.fileUrl.length>0){
        //             this.imgUrl=this.$store.state.fileUrl[0].url
        //         }else{
        //             this.imgUrl=""
        //         }
                
        //     }
        // },
        bookNum:{
            handler(){
                // 防抖
                this.timer=null
                if(this.timer){
                    clearTimeout(this.timer)
                }
                this.timer=setTimeout(()=>{
                    this.getBookInfo()
                },1000)
            }
        }
    },
    methods: {
        // 获取页面高度，并计算标签高度
        getHeight(){
            this.height=(window.innerHeight-61)+'px'
            this.addHeight=(window.innerHeight-110)+'px'
        },
        // 切换tab栏时触发
        change(){
            this.clear()
        },
        // 清空输入框的数据
        clear(){
            // this.$store.commit("clearFileUrl")
            this.desc=""
            this.chooseTypeList=[]
            this.bookName=""
            this.bookNum=""
            this.author=""
            this.press=""
            this.price=""
            this.position=""
            this.num=""
            this.imgUrl=""
        },
        // 新图书入库
        async addBooks(){
            if(!this.desc||!this.bookName||!this.bookNum||!this.author||!this.press||!this.price||!this.position||!this.num) return this.$message.warning({
                                                                                                                                            message:"请将信息填写完整！",
                                                                                                                                            duration:"2000",
                                                                                                                                            offset:110,
                                                                                                                                            showClose:true
                                                                                                                                        })
            if(this.chooseTypeList.length==0) return this.$message.warning({
                                message:"请至少选择一个分类！",
                                duration:"2000",
                                offset:110,
                                showClose:true
                            })
            if(!this.imgUrl) return this.$message.warning({
                                message:"请上传图书封面图片！",
                                duration:"2000",
                                offset:110,
                                showClose:true
                            })
            const params={
                bookName:this.bookName,
                bookNum:this.bookNum,
                author:this.author,
                type:this.getType(),
                press:this.press,
                price:this.price,
                position:this.position,
                num:this.num,
                desc:this.desc,
                imgUrl:this.imgUrl
            }
            const res=await AddNewBookApi(params)
            if(res.data.code==1){
                this.clear()
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
        // 添加已有图书库存
        async addBookNum(){
            if(!this.num||!this.bookNum) return this.$message.warning({
                                            message:"请将信息填写完整！",
                                            duration:"2000",
                                            offset:110,
                                            showClose:true
                                        })
            const params={
                num:this.num,
                bookNum:this.bookNum
            }
            const res=await AddBookNumApi(params)
            if(res.data.code==1){
                this.clear()
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
        async getBooksType(){
            const res=await BooksTypeApi()
            this.typeList=res.data.data
        },
        chooseType(type){
            if(this.chooseTypeList.includes(type)){
                this.chooseTypeList=this.chooseTypeList.filter((ele)=> ele!=type)
            }else{
                this.chooseTypeList.push(type)
            }
        },
        // 将所选分类拼接成一个字符串
        getType(){
            if(this.chooseTypeList.length==1) return this.chooseTypeList[0]
            let typeStr=""
            let num=0
            this.chooseTypeList.forEach((ele)=>{
                if(num==0){
                    typeStr=ele
                }else{
                    typeStr=typeStr+","+ele
                }
                num++
                
            })
            return typeStr
        },
        async getBookInfo(){
            const bookInfo=await getBookInfoByCode(this.bookNum)
            this.bookName=bookInfo.data.name
            this.author=bookInfo.data.author
            this.press=bookInfo.data.publishing
            this.price=bookInfo.data.price
            this.imgUrl=bookInfo.data.photoUrl
        },
        // 获取ISBN号
        getCode(code){
            this.bookNum=code
        },
        // 控制视频的显示与否
        setVideoShow(){
            this.showVideo=!this.showVideo
        }
    },
    created() {
        this.getHeight()
        this.getBooksType()
    },
    // mounted() {
    // // 全局事件总线
    //  this.$bus.$on("getBarCode",(code)=>{this.getBookInfo(code)})
    // },
    // beforeDestroy(){
    //   // 关闭全局事件总线
    //   this.$bus.$off("getBarCode")
    // },
}
</script>

<style scoped>
    .choose{
        display: flex;
        justify-content: center;
    }
    .add{
        /* margin-top: 50px; */
        width: 60%;
        padding: 20px;
        border-radius: 15px;
        box-shadow:1px 1px 2px 1px rgba(0, 0, 0, 0.2) ;
        overflow-y: scroll;
        box-sizing: border-box;
    }
    .title-box{
        display: flex;
        align-items: center;
    }
    .title{
        color: #303133;
        font-weight: bold;
        margin-right: 20px;
    }
    .tip{
        font-size: 14px;
        color: #606266;
    }
    .press{
        margin-left: 14px;
    }
    .input-info{
        width: 250px !important;
        margin-top: 20px;
        margin-right: 10px;
    }
    .btn-box{
        margin-top: 20px;
    }
    .bookType-box{
        display: flex;
        margin-top: 20px;
        flex-wrap: wrap;
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
    .desc{
        display: flex;
        margin-top: 20px;
    }
    .describe{
        width: 400px !important;
    }
    /* .img-upload-box{
        display: flex;
        margin-top: 20px;
    } */
    .typeChoosed{
        border-color: #409EFF;
        color: #409EFF;
    }
</style>