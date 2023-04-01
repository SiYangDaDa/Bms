<template>
  <div>
    <!-- 该组件主要是用于通过摄像头扫描图书条形码从而获取ISBN号 -->
    <i class="iconfont icon-saoma-big scan" @click="openScan"></i>
    <div id="video-box">
      <div id="video-container" v-if="showVideo">
        <video ref="video" id="video" autoplay></video>
        <div id="close-btn">
          <el-button type="danger" v-show="showBtn" class="closeBtn" @click="close">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { MessageBox } from 'mint-ui'
  import { BrowserMultiFormatReader } from '@zxing/library'
  export default {
    name: 'BarCode',
    components: {},
    props:["showVideo","setVideoShow"],
    data() {
      return {
        loadingShow: false,
        codeReader: new BrowserMultiFormatReader(),
        textContent: null,
        vin: null,
        tipMsg: '正在尝试识别....',
        tipShow: false,
        showBtn:false,
        video:null
      }
    },
    methods: {
      async openScan() {
        this.setVideoShow()
        const that = this
        that.codeReader.getVideoInputDevices().then((videoInputDevices) => {
          this.$message({
            message:"正在调用摄像头...",
            duration:1500,
            offset:110,
            onClose:setTimeout(()=>{this.showBtn=true},1000)
          })
          console.log('videoInputDevices', videoInputDevices);
          // 默认获取第一个摄像头设备id
          let firstDeviceId = videoInputDevices[0].deviceId;
          this.video=videoInputDevices[0]
          // this.video=videoInputDevices
          // console.log(this.viedo)
          // 获取第一个摄像头设备的名称
          const videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label);
          if (videoInputDevices.length > 1) {
            // 判断是否后置摄像头
            if (videoInputDeviceslablestr.indexOf('back') > -1) {
              firstDeviceId = videoInputDevices[0].deviceId
            } else {
              firstDeviceId = videoInputDevices[1].deviceId
            }
          }
          that.decodeFromInputVideoFunc(firstDeviceId)
        }).catch((err) => {
          console.error(err);
        });
      },
      async openScanTwo() {
        const that = this
        // codeReader.reset() // 重置
        // that.textContent = null // 重置
        that.codeReader = await new BrowserMultiFormatReader()
        that.codeReader.getVideoInputDevices().then((videoInputDevices) => {
          this.$message({
            message:"正在调用摄像头...",
            duration:1500,
            offset:80,
            onClose:setTimeout(()=>{this.showBtn=true},1000)
          })
          // 默认获取第一个摄像头设备id
          let firstDeviceId = videoInputDevices[0].deviceId;
          // 获取第一个摄像头设备的名称
          const videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label);
          if (videoInputDevices.length > 1) {
            // 判断是否后置摄像头
            if (videoInputDeviceslablestr.indexOf('back') > -1) {
              firstDeviceId = videoInputDevices[0].deviceId
            } else {
              firstDeviceId = videoInputDevices[1].deviceId;
            }
          }
          that.decodeFromInputVideoFunc(firstDeviceId)
        }).catch((err) => {
          console.error(err);
        });
      },
      decodeFromInputVideoFunc(firstDeviceId) {
        const that = this
        that.codeReader.reset() // 重置
        that.textContent = null // 重置
        that.codeReader.decodeFromInputVideoDeviceContinuously(firstDeviceId, 'video', (result, err) => {
          that.tipMsg = '正在尝试识别...'
          // let nowContent = null
          that.textContent = null
          if (result) {
            console.log(result);
            that.textContent = result.text;
            if (that.textContent) {
              that.tipShow = false
              that.msgBoxFunc(that.textContent)
            }
          }
          if (err && !(err)) {
            that.tipMsg = '识别失败'
            setTimeout(() => {
              that.tipShow = false
            },2000)
            console.error(err);
          }
        });
      },
      // that.$createDialog 是 cube-ui滴滴 messageBox ,到这一步 二维码值已出，这里是可有可无的代码块，看各自项目ui使用情况 自行替换 messageBox
      msgBoxFunc(textContent) {
        const that = this
        // alert('8执行了 msgBoxFunc(),textContent:' + textContent)
        // cube-ui messageBox
        that.$createDialog({
          type: 'prompt',
          // icon: 'cubeic-alert',
          title: '识别内容',
          // content: that.textContent,
          prompt: {
            value: textContent,
            placeholder: '请输入'
          },
          confirmBtn: {
            text: '确定内容',
            active: true,
            disabled: false,
            href: 'javascript:;'
          },
          cancelBtn: {
            text: '继续识别',
            active: false,
            disabled: false,
            href: 'javascript:;'
          },
          onConfirm: (e, promptValue) => {
            // that.hide()
            console.log('onConfirm: ()')
            that.vin = promptValue
          },
          onCancel: () => {
            console.log('onCancel: ()')
            that.$nextTick(()=>{
              that.openScanTwo()
            })
          }
        }).show()
      },
      // msgBoxFunc2() 整块代码是mint-ui  messageBox示例用，此处未使用，可直接注释；
      msgBoxFunc2(textContent) {
        // mint-ui  messageBox  有重复 inputValue值问题，新调用 显示是旧的值
        const that = this
        // alert('8执行了 msgBoxFunc(),textContent:' + textContent)
        MessageBox.prompt('识别内容', {
          inputValidator: (val) => {
            if (val === null) {
              return true;//初始化的值为null，不做处理的话，刚打开MessageBox就会校验出错，影响用户体验
            }
          },
          confirmButtonText: '确定内容',
          cancelButtonText: '继续识别',
          inputValue: textContent,
        }).then(({value, action}) => {
          if (action === 'confirm') {
            that.vin = value
          }
          if (action === 'cancel') {
            that.$nextTick(()=>{
              that.openScanTwo()
            })
          }
        }).catch(err => {
          console.log(err);
        })
      },
      // 关闭摄像头并移除video标签
      close(){
        let videoElem=this.$refs["video"]
        const stream = videoElem.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(function(track) {
          track.stop();
        });
        videoElem.srcObject = null
        this.setVideoShow()
      }
    }
  }
</script>
<style scoped>
  /*vjs-fluid 自适video 长宽*/
  .scan{
    color:#409EFF;
    font-size: 19px;
  }
  .scan:hover{
    cursor: pointer;
  }
  #video-box{
    position: fixed;
    top: 50px;
    right: 20px;
  }
  #video-container{
    position: relative;
  }
  #video{
    width: 200px;
    height: 200px;
  }
  #close-btn{
    position: absolute;
    bottom: 40px;
    left: 75px;
  }
  .closeBtn{
    width: 50px !important;
    height: 30px !important; 
    padding: 0 !important;
  }
  .tip{
    color: white;
    font-size: 14px;
  }
</style>