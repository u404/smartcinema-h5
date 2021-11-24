<template>
  <section class="videoplay">
    <section class="video-container" v-show="videoVisiable">
      <video-player  class="video-player-box"
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)"
        @statechanged="playerStateChanged($event)"
        @ready="playerReadied($event)"
        @error="onPlayerError($event)"
        @waiting="onPlayerWaiting($event)"
        @playing="onPlayerPlaying($event)"
        @timeupdate="onPlayerTimeUpdate($event)"
        @ended="onPlayerEnded($event)"
        @loadedmetadata="onPlayerLoadedMetaData($event)"
        @stalled="onPlayerStalled($event)">
      </video-player>
    </section>
    <sc-confirm :confirmVisiable="confirmShow" msg="转到App观影3分钟可参与抽奖，且App内可观看完整电影" confirmText="确定" cancelText="取消" @cancel="cancelConfirm" @confirm="toDownload" ></sc-confirm>
  </section>
</template>

<script>
import "video.js/dist/video-js.css"
import { videoPlayer } from "vue-video-player"
import ScConfirm from "@/components/ScConfirm"
import "videojs-contrib-hls"
import utils from "@/common/scripts/utils"
import { mapState } from "vuex"
export default {
  data () {
    return {
      confirmShow: false,
      playerOptions: {
        width: document.documentElement.clientWidth,
        autoplay: false,
        fluid: true,
        muted: false,
        language: "zh-CN",
        sources: [],
        poster: "",
        controlBar: {
          remainingTimeDisplay: false
        }
      },
      playInfo: {},
      filmData: {},
      first: true,
      initTime: 0,
      ticketNo: "",
      fullFirst: true,
      videoVisiable: true,
      filmId: "",
      type: ""
    }
  },
  components: {
    videoPlayer, ScConfirm
  },
  computed: {
    ...mapState([
      "login"
    ]),
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {
    cancelConfirm () {
      this.confirmShow = false
      this.$router.go(-1)
    },
    toDownload () {
      this.videoVisiable = true
      this.$callapp.gotoPage()
    },
    onPlayerPlay (player) {
      // if (this.fullFirst) {
      //   this.fullFirst = false
      //   this.uploadProgress(this.ticketNo, this.playInfo.playProgress || 1, 0)
      //   try {
      //     player.requestFullscreen()
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }
      player.loadingSpinner.hide()
      this.$sensors.track("h5_watch_film_control", {
        sku_id: "",
        film_name: "",
        ticket_no: this.ticketNo,
        start_play_time: "",
        current_playgress: parseInt(this.player.currentTime()),
        watch_style: "小屏",
        buttun_tpye: "播放"
      })
    },
    onPlayerPause (player) {
      this.uploadProgress(this.ticketNo, parseInt(this.player.currentTime()), 1)
      this.$sensors.track("h5_watch_film_control", {
        sku_id: "",
        film_name: "",
        ticket_no: this.ticketNo,
        start_play_time: "",
        current_playgress: parseInt(this.player.currentTime()),
        watch_style: "小屏",
        buttun_tpye: "暂停"
      })
    },
    playerStateChanged (playerCurrentState) {},
    onPlayerStalled (player) {
      this.uploadProgress(this.ticketNo, parseInt(this.player.currentTime()), 3)
    },
    playerReadied (player) {
      player.play()
      // player.controlBar.progressControl.disable()
    },
    onPlayerWaiting (player) {
      player.loadingSpinner.show()
    },
    onPlayerPlaying (player) {},
    // 播放报错
    onPlayerError (player) {
      this.uploadProgress(this.ticketNo, parseInt(this.player.currentTime()), 2)
      this.$toast.showToast("服务器开小差了，请您稍后再试")
    },
    onPlayerTimeUpdate (player) {
      // 进度条跳转
      if (this.playInfo.playProgress && this.first) {
        this.first = false
        player.currentTime(this.playInfo.playProgress)
      }
      // 定时60s上报
      if (player.currentTime() - this.initTime > 5) {
        let playProgress = this.initTime = parseInt(player.currentTime())
        this.uploadProgress(this.ticketNo, playProgress, 0)
      }
    },
    // 播放结束
    onPlayerEnded (player) {
      this.player.dispose()
      this.type !== "summer2021" && this.uploadProgress(this.ticketNo, this.playInfo.filmLength, 4)
      this.$toast.showToast("您已观影完毕")
      let time = setTimeout(() => {
        this.$router.go(-1)
        clearTimeout(time)
      }, 2000)
      // this.confirmShow = true
    },
    // 上报进度
    async uploadProgress (ticketNo, playProgress, reportType) {
      await utils.to(this.$services.home.filmProgressUpload({ ticketNo, playProgress, reportType }))
    }
  },
  async created () {
    if (!this.login && !localStorage.getItem("token")) {
      this.$router.push({ name: "login" })
      return
    }
    this.type = this.$route.query.type || ""
    let filmId = this.filmId = this.$route.query.filmId
    let ticketNo = this.ticketNo = this.$route.query.ticketNo
    let playPromise = utils.to(this.$services.home.getFilmPlayInfo({ ticketNo }))
    let filmPromise = utils.to(this.$services.home.getFilmDetail({ filmId }))
    let [playErr, playData] = await playPromise
    let [filmErr, filmData] = await filmPromise
    if (playErr || filmErr) {
      this.$toast.showToast("请到移动电影院app观看")
      let time = setTimeout(() => {
        this.$router.back(-1)
        clearTimeout(time)
      }, 2000)
      return
    }
    if (playData.playProgress === playData.filmLength) {
      this.uploadProgress(this.ticketNo, playData.filmLength, 4)
      this.$toast.showToast("已观影完毕")
      let time = setTimeout(() => {
        this.$router.back(-1)
        clearTimeout(time)
      }, 2000)
      return
    }
    this.filmData = filmData
    this.playInfo = playData
    this.player.src(this.type === "summer2021" ? filmData.positiveFragmentUrl : playData.streamInfo[0].videoUrl)
    this.player.poster(this.filmData.filmHeadImg || this.filmData.video[0].videoImg)
    document.querySelector(".vjs-custom-control-spacer").addEventListener("click", () => {
      this.confirmShow = true
      this.player.pause()
      this.videoVisiable = false
    })
  },
  // 组件销毁前上报
  beforeDestroy () {
    this.uploadProgress(this.ticketNo, parseInt(this.player.currentTime()), 5)
  }
}
</script>

<style lang="scss" scoped>
.videoplay {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 1);
  position: relative;
  .video-container{
    position: absolute;
    width: rem(375);
    height: rem(375*0.8);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /deep/ .vjs-big-play-button{
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: rem(59);
      height: rem(59);
      background: url(https://g.smartcinema.com.cn/images/b7628966b4564825a0b780b5cdc0b4ce-118-118.png) 0 0 no-repeat;
      background-size: 100% 100%;
      border: none;
      &::after{
        content: "";
        display: none !important;
      }
      .vjs-icon-placeholder{
        display: none;
      }
    }
    /deep/ .vjs-poster{
      background-size: cover;
    }
    /deep/ .vjs-time-control{
      display:block;
    }
    /deep/ .vjs-custom-control-spacer{
      display: block !important;
      position: absolute;
      top: rem(-80);
      right: rem(0);
      width: rem(60);
      height: rem(25);
      // background: url(https://g.smartcinema.com.cn/images/c3f55af95a444010b79325b4787811d5-180-76.png);
      background-size: 100% 100%;
    }
  }
}
</style>
