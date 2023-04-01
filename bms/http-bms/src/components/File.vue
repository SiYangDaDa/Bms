<template>
    <div id="fileContainer">
        <div class="img-List" v-for="(i,index) in imgList" :key="index">
            <img :src="i.url" alt="">
        </div>
        <el-button type="danger" @click="clearUpload" v-if="!fileName&&imgList.length>0">清空</el-button>
        <div id="file" v-if="imgList.length<=0">
            <i class="el-icon-plus" id="add" v-if="!fileName" @click="chooseFile"></i>
            <img src="../assets/img/img.png" alt="" v-if="fileName">
            <p v-if="fileName">{{fileName}}</p>
            <div id="button">
                <el-button type="primary" @click="upload" v-if="fileName">上传</el-button>
                <el-button type="danger" @click="deleteFile" v-if="fileName">重选</el-button>
            </div>
        </div>
        <input type="file" ref="input" style="opacity:0" accept="image/*" class="file-input"><br>
    </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import {UpLoadTokenApi} from "../http/api"
export default {
    name:"File",
    data() {
        return {
            file:{},//文件
            url:"",//文件链接
            fileName:"",//文件名
            imgList:[]
        }
    },
    watch:{
        '$store.state.fileUrl':{
            deep:true,
            handler(){
                this.imgList=this.$store.state.fileUrl
                // console.log(this.imgList)
            }
        }
    },
    methods:{
        // 上传文件
        async upload(){
            if(this.$refs.input.files.length===0){
                alert("请选择文件！")
            }else{
                const res=await UpLoadTokenApi()
                let token=res.data.token
                // let file=this.$refs.input.files[0]
                // this.fileName=file.name
                const putExtra={}
                const config = {
                    useCdnDomain: true,
                    region: qiniu.region.z2
                }
                let that =this
                const observable = qiniu.upload(this.file, this.fileName, token, putExtra, config)
                const observer = {
                    next(res){
                        console.log(res)
                    },
                    error(err){
                        console.log(err)
                    },
                    complete(res){
                        that.url="rmwx2ewqs.hn-bkt.clouddn.com"+"/"+res.key
                        var obj={
                            url:'http://'+that.url,
                            name:res.key
                        }
                        // 将文件链接保存到vuex
                        // that.$store.commit("getFileUrl",obj)
                    }
                }
                observable.subscribe(observer)
            }
            this.deleteFile()
        },
        // 通过点击选择文件框中加号触发input标签的点击事件
        chooseFile(){
            this.$refs.input.dispatchEvent(new MouseEvent('click'))
        },
        // 清空已选的文件
        deleteFile(){
            this.$refs.input.value=''
            this.file={}
            this.fileName=""
        },
        clearUpload(){
            this.$store.commit("clearFileUrl")
        }
    },
    mounted() {
        this.$refs.input.addEventListener("change",()=>{
            this.file=this.$refs.input.files[0]
            this.fileName=this.$refs.input.files[0].name
        })
    },
}
</script>

<style scoped>
    #fileContainer{
        display: flex;
        /* justify-content: center; */
        align-items: center;
    }
    .img-List{
        height: 100px;
        width: 100px;
        position: relative;
        border: 1px dashed #bfbfbf;
        border-radius: 10px;
        margin-right: 10px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .img-List>img{
        width: 100%;
    }
    #file{
        height: 100px;
        width: 100px;
        background-color: rgba(255,255,255,0.5);
        text-align: center;
        position: relative;
        border: 1px dashed #bfbfbf;
        border-radius: 10px;
    }
    #file:hover{
        border: 1px dashed #409EFF;
        cursor:pointer;
    }
    #add{
        font-size: 40px;
        color:#bfbfbf;
        margin-top: 25px;
    }
    #file>p{
        font-size:14px;
    }
    #file>:nth-child(2){
        color: gray;
    }
    #file>img{
        width: 40px;
        margin-top: 15px;
    }
    #button{
        position: absolute;
        left:110px;
        top:0px;
    }
    #button>:first-child{
        margin-top: 10px;
    }
    #button>:last-child{
        margin-left: 0;
        margin-top: 10px;
    }
    .file-input{
        position: fixed;
        top:-20px
    }
</style>