<template>
  <div class="detail" style="padding-bottom:1rem;">
    <div class="videoplay" v-show="videoUrl">
      <div class="video-container">
        <video-player  class="video-player-box"
          ref="videoPlayer"
          :options="playerOptions"
          :playsinline="true"
          @play="onPlayerPlay($event)"
          @error="onPlayerError($event)"
          @waiting="onPlayerWaiting($event)"
          @ended="onPlayerEnded($event)">
        </video-player>
      </div>
      <div class="hint-app-container" :style="`background:url(${filmData.filmImgPath}) 0 0 no-repeat;background-size: cover;`" v-if="noticeShow">
        <div class="hint-app-box">
          <p>{{ ticketNo ? "试看结束，下载APP可观看完整影片" : "试看结束，购票后可观看完整影片" }}</p>
          <div class="hint-btns">
            <span class="retry-btn" @click="retryPlay"></span>
            <span class="openapp-btn" @click="confirmShow = true"></span>
          </div>
        </div>
      </div>
      <sc-confirm :confirmVisiable="confirmShow" msg="下载移动电影院APP" @cancel="confirmShow = false" @confirm="toDownload" confirmText="确定" cancelText="取消"></sc-confirm>
    </div>
    <div class="image-container" v-show="imageUrl">
      <img :src="imageUrl" />
    </div>
    <div class="filmInfo">
      <h2 class="filmName">{{filmData.filmNameCn}}</h2>
      <h4 class="filmTag">{{filmData.desc}}</h4>
      <h5 class="filmDate">{{filmData.filmReleaseTime}}</h5>
      <div class="filmDesc">
        <ellipsis-text line="3" :content="filmData.introduction" revealTextColor="#666"></ellipsis-text>
      </div>
    </div>
    <sub-title title="主创人员" />
    <actor-slide :actorData="filmData.performers" />
    <sub-title title="剧照"  />
    <photo :photos="filmData.photo" />
    <div class="bp-button"  @click="filmHandle">{{buttonText}}</div>
    <sc-confirm :closable="true" confirmTitle="提示" msgColor="#666666"  cancelTextColor="#E8BF8F" confirmTextColor="#999999" :confirmVisiable="ticketConfirmShow" :msg="allowable? `影片未看完，请选择继续观影或重新购票参与活动<span style='color:#EF1919;'>（该影片已有的票将被核销）</span>` :'今日抽奖机会已用完'" cancelText="继续观影" :confirmText="allowable?'重新购票': '明日参与'" @cancel="cancleHandle" @confirm="confirmHandle" @close="ticketConfirmShow = false"></sc-confirm>
  </div>
</template>

<script>
import SubTitle from "@/components/SubTitle"
import ActorSlide from "@/components/ActorSlide"
import EllipsisText from "@/components/EllipsisText"
import Photo from "@/components/Photo"
import { videoPlayer } from "vue-video-player"
import "video.js/dist/video-js.css"
import ScConfirm from "@/components/ScConfirm"
import "videojs-contrib-hls"
import utils from "@/common/scripts/utils"
import { mapState, mapMutations } from "vuex"
import env from "@sc/lib-env"
export default {
  name: "detail",
  components: {
    SubTitle, videoPlayer, ActorSlide, EllipsisText, Photo, ScConfirm
  },
  data () {
    return {
      filmData: {},
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
      noticeShow: false,
      buy: 1,
      videoUrl: "",
      imageUrl: "",
      needHdc: "",
      inApp: env.browser.inApp,
      ticketNo: "",
      skuId: "",
      skip: "",
      ticketConfirmShow: false,
      allowable: true,
      prizeActivityCode: "",
      showStatus: 0,
      type: ""
    }
  },
  computed: {
    ...mapState([
      "userCode", "login"
    ]),

    player () {
      return this.$refs.videoPlayer && this.$refs.videoPlayer.player
    },
    buttonText () {
      let text = ""
      if (this.ticketNo) {
        text = this.inApp || this.skip === "spring" || this.skip === "hundred" ? "去观影" : this.skip === "dangjian" || this.skip === "summer2021" ? "抢鲜观影6分钟" : "下载APP 观看完整版"
      } else {
        text = this.skip === "spring" || this.skip === "hundred" ? "去观影" : "去购票"
      }
      return text
    }
  },
  methods: {
    ...mapMutations([
      "SHARE_CONFIG", "CHANGE_SLOGAN_VISIBLE"
    ]),
    // 0元支付，直接购买
    directPay (skuId) {
      return this.$services.order.directPay({ skuId, buyNumber: "1", payType: 0 }).catch(err => {
        this.$alert((err && err.msg) || "抢票失败，请重试")
        throw new Error()
      })
    },
    async filmHandle () {
      if (this.showStatus === 2) {
        this.$toast.showToast("活动已结束")
        return
      }
      let { filmData: { filmId, spuId }, skip, needHdc, ticketNo, skuId } = this
      if (ticketNo) {
        if (skip === "spring") {
          this.ticketConfirmShow = true
          return
        }
        if (skip === "summer2021" || skip === "dangjian" || skip === "hundred") {
          this.toMoviePlayPage(ticketNo, filmId)
        } else if (!env.browser.inApp) {
          this.confirmShow = true
        } else {
          this.toMoviePlayPage(ticketNo, filmId)
        }
      } else {
        if (!this.login && env.browser.inApp) {
          this.$windvane.call("SCHYUIInterface.showLoginPage")
          if (skip === "spring") {
            this.$router.replace({ name: "spring", query: { source: "banner" } })
          } else if (skip === "hundred") {
            this.$router.replace({ name: "qiyihundred", query: { source: "banner" } })
          }
        } else {
          if (skip === "hundred") {
            if (!this.login) {
              this.$router.push({ name: "login", query: { redirect: `${location.hash.slice(1)}` } })
              return
            }
            this.directPay(skuId).then(res => {
              const { paymentResponseDTO: { filmId, tickets } } = res
              this.toMoviePlayPage(tickets[0], filmId)
            })
          } else {
            this.$router.push({ name: "pay", query: { spuId, needHdc, skip, skuId } })
          }
        }
      }
    },
    toMoviePlayPage (ticketNo, filmId) {
      if (this.inApp) {
        const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
        env.browser.inApp ? this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL }) : this.$router.push({ name: "play", query: { filmId, ticketNo } })
      } else {
        this.$router.push({ name: "play", query: { filmId, ticketNo, type: this.skip } })
      }
    },
    toDownload () {
      this.confirmShow = false
      this.$callapp.gotoPage()
    },
    onPlayerPlay (player) {
      // eslint-disable-next-line camelcase
      let { skuId: sku_id, filmNameCn: film_name } = this.filmData
      player.loadingSpinner.hide()
      this.$sensors.track("h5_play_pre_movie", {
        sku_id,
        film_name
      })
    },
    onPlayerWaiting (player) {
      player.loadingSpinner.show()
    },
    // 播放报错
    onPlayerError (player) {
      this.$toast.showToast("服务器开小差了，请您稍后再试")
    },
    // 播放结束
    onPlayerEnded (player) {
      !env.browser.inApp && (this.noticeShow = true)
    },
    // 重播
    retryPlay () {
      this.noticeShow = false
      this.player.play()
    },
    cancleHandle () {
      this.ticketConfirmShow = false
      let { ticketNo, filmId } = this.filmData
      // 继续观影
      env.browser.inApp ? this.toMoviePlayPage(ticketNo, filmId) : this.$callapp.gotoPage({
        pathname: "web",
        params: {
          stringUrl: encodeURIComponent(`${location.origin}/index.html#/operation/spring?source=banner`)
        }
      })
    },
    async confirmHandle () {
      if (!this.allowable) {
        this.ticketConfirmShow = false
        return
      }
      let { ticketNo, playProgress, spuId } = this.filmData
      // 重新参与活动
      await utils.to(this.$services.home.filmProgressUpload({ ticketNo, playProgress, reportType: 4 }))
      this.ticketConfirmShow = false
      this.$router.push({ name: "pay", query: { spuId, needHdc: "activity", skip: this.skip, skuId: this.skuId } })
    },
    getActivityBaseInfo () {
      return this.$services.operation.getActivityBasic({ type: "newYearFilm" }).then((res) => {
        return res
      }).catch(e => {
        this.showStatus = 2
      })
    },
    async getPrizeDetail (code) {
      if (!code) return
      let [prizeErr, prizeData] = await utils.to(this.$services.operation.getLotteryDetail({ code }))
      !prizeErr && (this.allowable = !!prizeData.allowable)
    }
  },
  async mounted () {
    const loading = this.$toast.showLoading()
    let filmId = this.$route.query.filmId
    this.buy = Number(this.$route.query.buy) !== 0
    this.skuId = this.$route.query.skuId || ""
    !this.buy && env.browser.inApp && this.CHANGE_SLOGAN_VISIBLE()
    this.needHdc = this.$route.query.needHdc || ""
    this.skip = this.$route.query.skip || ""
    this.type = this.$route.query.type || ""
    this.prizeActivityCode = this.$route.query.code
    let [err, data] = await utils.to(this.$services.home.getFilmDetail({ filmId }))
    this.$toast.close(loading)
    if (err) {
      this.$toast.showToast(err.msg)
      return
    }
    if (data.ticketNo && this.skuId) {
      data.ticketData.forEach(item => {
        if (item.skuId === +this.skuId) {
          this.ticketNo = item.ticketNo
        }
      })
    } else {
      this.ticketNo = data.ticketNo
    }
    this.filmData = data
    this.$sensors.track("h5_film_detail_enter", {
      sku_id: this.skuId,
      film_name: data.filmNameCn
    })
    let code = this.userCode || utils.getQueryString("ucode")
    this.SHARE_CONFIG({
      title: data.filmNameCn,
      desc: data.introduction,
      link: `${location.origin}${location.pathname}?ucode=${code || ""}#/detail?filmId=${filmId}&buy=1&skuId=${this.skuId}&skip=${this.skip}&needHdc=${this.needHdc}`,
      img: "https://g.smartcinema.com.cn/images/f66f152f7b9240e2b57b0d33b1e90d32-120-120.jpg", // 分享图标
      jsApiList: ["chooseWXPay"]
    })
    if ((data.video.length && /^https?.+\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/i.test(data.video[0].videoUrl))) {
      this.videoUrl = data.video[0].videoUrl
      this.player.poster(data.filmHeadImg || data.video[0].videoImg)
      this.player.src(data.video[0].videoUrl)
    } else {
      this.imageUrl = data.filmHeadImg || (data.video.length && data.video[0].videoImg)
    }
    if (this.skip === "spring") {
      this.getActivityBaseInfo().then(res => {
        this.showStatus = res.showStatus
        res.showStatus !== 2 && this.login && this.getPrizeDetail(this.prizeActivityCode)
      })
    }
    window.scrollTo(0, 1)
  }
}
</script>

<style lang="scss" scoped>
.detail {
  background: rgba(247, 247, 247, 1);
  min-height: 100vh;
  padding-bottom: rem(80);
  .headImage{
    display: block;
    width: 100%;
    height: rem(211);
    object-fit: cover;
  }
  /deep/ .photo{
    padding-bottom: rem(44);
  }
  .filmInfo{
    padding: rem(30) rem(15) 0;
    .filmName{
      height:rem(28);
      font-size:rem(24);
      font-weight:700;
      color:rgba(51,51,51,1);
      line-height:rem(28);
    }
    .filmTag{
      height:rem(17);
      font-size:rem(12);
      font-weight:300;
      color:rgba(102,102,102,1);
      line-height:rem(17);
      margin: rem(18) 0 rem(10);
    }
    .filmDate{
      height:rem(14);
      font-size:rem(12);
      font-weight:400;
      color:rgba(238,47,47,1);
      line-height:rem(14);
    }
    /deep/ .vx-ellipsis-text{
      margin-top: rem(10);
    }
    /deep/ .ellipsis-content, /deep/ .ellipsis-more{
      font-size:rem(12);
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height:rem(20);
    }
    /deep/ .ellipsis-more{
      width: rem(40);
      height: rem(20);
      cursor: pointer;
      color: #999999;
      padding-left: rem(10);
      background: #f7f7f7;
    }
  }
  .bp-button{
    position: fixed;
    bottom: rem(30);
    left: 0;
    right: 0;
    margin: auto;
    z-index: 10;
    width: rem(345);
    height: rem(44);
    line-height: rem(44);
    border-radius:rem(24);
    font-size:rem(16);
    font-weight:500;
    background:rgba(204,140,68,1);
    color: #ffffff;
    margin: 0 auto;
    text-align: center;
  }
  .image-container{
    width: rem(375);
    img{
      width: 100%;
      display: block;
    }
  }
  .videoplay{
    width:rem(375);
    position: relative;
    .video-container{
      /deep/ .video-js .vjs-control-bar{
        background: transparent;
      }
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
    }
    .hint-app-container{
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0ex;
      width: 100%;
      z-index: 2;
      .hint-app-box{
        background:rgba(0,0,0,0.66);
        width: 100%;
        height: 100%;
        @include flex($flow: column,$jus:center);
        p{
          font-size:rem(12);
          font-weight:400;
          color:rgba(255,255,255,1);
          line-height:rem(17);
        }
        .hint-btns{
          margin-top: rem(15);
          span{
            display: inline-block;
            width: rem(80);
            height: rem(30);
          }
          .retry-btn{
            background: url(https://g.smartcinema.com.cn/images/18de1ad9dc6346048264aa37dd4c1c41-160-60.png) 0 0 no-repeat;
            background-size:100% 100%;
            margin-right: rem(20);
          }
          .openapp-btn{
            background: url(https://g.smartcinema.com.cn/images/8b4ff459f2dd4eaab2a4a924f1bc7c52-152-52.png) 0 0 no-repeat;
            background-size:100% 100%;
          }
        }
      }
    }
  }

}
</style>
