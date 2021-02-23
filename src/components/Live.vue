<template>
  <div class="video-box">
    <videoPlayer
    ref="videoPlayer"
    :options="videoOptions"
    class="vjs-custom-skin videoPlayer"
    :playsinline='false'
    />



    <div align="center">
      <el-button type="success" @click="pushVideo">推流</el-button>
      <el-button type="primary" @click="changeCamera">反转摄像头</el-button>
      <el-button type="danger" @click="stopVideo">断流</el-button>

    </div>

  </div>

</template>


<script>
  import 'video.js/dist/video-js.css'
  import 'vue-video-player/src/custom-theme.css'
  import {
    videoPlayer
  } from 'vue-video-player'

  import 'videojs-flash'
  export default {
    components: {
      videoPlayer
    },
    data() {
      return {
        liveSrc: '',
        // 视频播放
        videoOptions: {

          fullscreenToggle: true, // 全屏按钮
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          techOrder: ['flash', 'html5'], // 兼容顺序
          sources: [{ // 流配置，数组形式，会根据兼容顺序自动切换
            type: 'rtmp/hls',
            src: '',
          }],
          poster: "", //你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: false,
            durationDisplay: false,
            remainingTimeDisplay: false,
            currentTimeDisplay: false, // 当前时间
            volumeControl: false, // 声音控制键
            playToggle: false, // 暂停和播放键
            progressControl: false, // 进度条
            fullscreenToggle: true // 全屏按钮
          },

        }
      }
    },



    created() {
      this.user = this.$route.query.userid;
      this.liveSrc ="rtmp://live.ibananai.cn/live/"+ this.$route.query.userid;
      this.videoOptions['sources'][0]['src'] = this.liveSrc;
     // this.sources.src = "rtmp://live.ibananai.cn/live/"+this.user;
    },



    methods: {
      async pushVideo() {
        const {
          data: res
        } = await this.$http.get('push_video/' + this.user)

        if (res !== 140) {
          return this.$message.error('推流失败！')
        } else {
          return this.$message.success('推流成功！')
        }
      },

      async stopVideo() {
        const {
          data: res
        } = await this.$http.get('stop_video/' + this.user)

        if (res !== 141) {
          return this.$message.error('断流失败，用户已断流！')
        } else {
          return this.$message.success('断流成功！')
        }
      },

      async changeCamera() {
        const {
          data: res
        } = await this.$http.get('change_camera/' + this.user)

        if (res !== 142) {
          return this.$message.error('转换摄像头失败！')
        } else {
          return this.$message.success('转换摄像头成功！')
        }
      },

    }

  }
</script>
<style scoped>
  .video-box {
    width: 800px;
    height: 800px;
    position: absolute;
    left: 50%;
    top: 60%;
    -webkit-transform: translate(-50%, -50%);
  }
</style>
