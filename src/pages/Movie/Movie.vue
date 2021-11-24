<template>
  <div class="detail" style="padding-bottom:1rem;">
    <div class="header" v-if="!inApp">
      <img class="banner-image" :src="baseInfo.bannerImage" />
    </div>
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
          <p>{{ ticketData.ticketNo ? "试看结束，下载APP可观看完整影片" : "试看结束，购票后可观看完整影片" }}</p>
          <div class="hint-btns">
            <span class="retry-btn" @click="retryPlay"></span>
            <span class="openapp-btn" @click="toDownload"></span>
          </div>
        </div>
      </div>
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
    <div class="buttons" v-if="ticketStatus">
      <div class="b-button b-button--single" @click="filmHandle">{{ticketData.ticketNo ? "去观影": "0.99单片看"}}</div>
      <div class="b-button b-button--pack" v-if="packButton" @click="toPackPay">3元看全场</div>
    </div>
  </div>
</template>

<script>
import SubTitle from "@/components/SubTitle"
import ActorSlide from "@/components/ActorSlide"
import EllipsisText from "@/components/EllipsisText"
import Photo from "@/components/Photo"
import { videoPlayer } from "vue-video-player"
import "video.js/dist/video-js.css"
import utils from "@/common/scripts/utils"
import { mapState, mapMutations } from "vuex"
import env from "@sc/lib-env"
export default {
  name: "detail",
  components: {
    SubTitle, videoPlayer, ActorSlide, EllipsisText, Photo
  },
  data () {
    return {
      filmData: {},
      filmSku: "",
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
      videoUrl: "",
      imageUrl: "",
      needHdc: "",
      inApp: env.browser.inApp,
      skuIds: [],
      showStatus: 0,
      type: "",
      ticketStatus: null,
      ticketData: {},
      baseInfo: {},
      env: env.browser.inApp ? "站内" : "站外"
    }
  },
  computed: {
    ...mapState([
      "userCode", "login"
    ]),
    player () {
      return this.$refs.videoPlayer && this.$refs.videoPlayer.player
    },
    packButton () {
      return (this.ticketStatus && this.ticketStatus.enableBuyCollection) || !this.login
    }
  },
  methods: {
    ...mapMutations([
      "SHARE_CONFIG", "CHANGE_SLOGAN_VISIBLE", "RECORD_USERINFO", "RECORD_USERCODE", "RECORD_POINTS"
    ]),
    cancelTicket (activityId, skuId = "") {
      return this.$services.operation.cancelTickets({ activityId, skuId }).catch(err => {
        this.$toast.showToast(err.msg)
      })
    },
    cancelConfirm (id, skuId = "", cb) {
      let { ticketNo, filmId } = this.ticketData
      this.$confirm.showConfirm({
        closable: true,
        title: "提示",
        msgColor: "#666666",
        cancelTextColor: "#E8BF8F",
        confirmTextColor: "#999999",
        msg: "您所购影片未播放完，请选择继续观影或重新购票参与",
        cancelText: ticketNo ? "去观影" : "",
        confirmText: "重新购票参与",
        confirmClick: () => {
          const loading = this.$toast.showLoading()
          this.cancelTicket(id, skuId).then(() => {
            this.$toast.close(loading)
            this.$confirm.close()
            cb && cb()
          })
        },
        cancelClick: () => {
          this.$confirm.close()
          this.toMoviePlayPage(ticketNo, filmId)
        }
      })
    },
    toPackPay () {
      this.$sensors.track("activity_film_detail_pack_buy", {
        activity_id: "20211001",
        activity_name: "2021国庆七天乐活动",
        sku_id: this.filmSku,
        film_name: this.filmData.filmNameCn,
        enter_type: this.env
      })
      if (env.browser.inApp && !this.login) {
        this.$windvane.call("SCHYUIInterface.showLoginPage")
        return false
      }
      if (this.ticketStatus.enableBuyCollection || !this.login) {
        if (this.ticketStatus.needCancelTicket) {
          this.cancelConfirm(this.baseInfo.id, "", () => {
            this.$router.push({ name: "pay", query: { skip: "package", type: this.type, filmId: this.filmData.filmId } })
          })
        } else {
          this.$router.push({ name: "pay", query: { skip: "package", type: this.type, filmId: this.filmData.filmId } })
        }
      }
    },
    getTicketStatus (activityId) {
      return this.$services.operation.getTicketState({ activityId }).then(res => {
        this.ticketStatus = res
      }).catch((err) => {
        this.$toast.showToast(err.msg)
      })
    },
    async filmHandle () {
      if (this.showStatus === 2) {
        this.$toast.showToast("活动已结束")
        return
      }
      let { filmData: { filmId, spuId }, type: skip, needHdc, ticketData: { ticketNo, todayTicket }, filmSku } = this
      if (ticketNo && !todayTicket) {
        this.cancelConfirm(this.baseInfo.id, filmSku, () => {
          this.$router.push({ name: "pay", query: { spuId, needHdc, skip, skuId: filmSku, filmId } })
        })
        return
      }
      if (ticketNo) {
        this.toMoviePlayPage(ticketNo, filmId)
      } else {
        this.$sensors.track("activity_film_detail_single_buy", {
          activity_id: "20211001",
          activity_name: "2021国庆七天乐活动",
          sku_id: this.filmSku,
          film_name: this.filmData.filmNameCn,
          enter_type: this.env
        })
        if (!this.login && env.browser.inApp) {
          this.$windvane.call("SCHYUIInterface.showLoginPage")
        } else {
          this.$router.push({ name: "pay", query: { spuId, needHdc, skip, skuId: filmSku, filmId } })
        }
      }
    },
    toMoviePlayPage (ticketNo, filmId) {
      if (this.inApp) {
        const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
        this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
      } else {
        this.toDownload()
      }
    },
    toDownload () {
      this.$confirm.showConfirm({
        msg: "下载移动电影院APP",
        confirmClick: () => {
          this.$confirm.close()
          this.$callapp.gotoPage()
        },
        cancelClick: () => {
          this.$confirm.close()
        }
      })
    },
    onPlayerPlay (player) {
      // eslint-disable-next-line camelcase
      let { filmSku: sku_id, filmNameCn: film_name } = this.filmData
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
      let { ticketNo, filmId } = this.ticketData
      // 继续观影
      env.browser.inApp ? this.toMoviePlayPage(ticketNo, filmId) : this.$callapp.gotoPage()
    },
    getActivityBaseInfo (type) {
      return this.$services.operation.getActivityBasic({ type }).then((res) => {
        this.baseInfo = res
        return res
      }).catch(e => {
        this.showStatus = 2
      })
    },
    getActivityFilmList (type, activityId = "") {
      return this.$services.operation.getActivityFilms({ type, activityId }).then(res => {
        return res
      }).catch(err => {
        this.$toast.showToast(err.msg)
      })
    },
    appShareIconClick () {
      this.$sensors.track("activity_page_share", {
        activity_id: "20211001",
        activity_name: "2021国庆七天乐活动",
        sku_id: this.filmSku,
        film_name: this.filmData.filmNameCn,
        page_name: "影片详情页"
      })
    },
    async getUserInfo (uid) {
      let codePromise = utils.to(this.$services.user.getuserCode({ "X-User-Id": uid }))
      let pointsPromise = utils.to(this.$services.user.getUserPoints({ "X-User-Id": uid }))
      let [codeErr, codeData] = await codePromise
      let [pointstErr, pointsData] = await pointsPromise
      !codeErr && this.RECORD_USERCODE(codeData.code)
      !pointstErr && this.RECORD_POINTS(pointsData)
    },
    init (filmId, loading) {
      this.getActivityFilmList(this.type).then(async res => {
        this.ticketData = res.filter(item => {
          this.skuIds.push(item.skuId)
          return +item.filmId === +filmId
        })[0]
        this.filmSku = this.ticketData.skuId
        this.ticketNo = this.ticketData.ticketNo || ""
        let [err, data] = await utils.to(this.$services.home.getFilmDetail({ filmId }))
        this.$toast.close(loading)
        if (err) {
          this.$toast.showToast(err.msg)
          return
        }
        this.filmData = data
        this.$sensors.track("activity_film_detail", {
          activity_id: "20211001",
          activity_name: "2021国庆七天乐活动",
          sku_id: this.filmSku,
          film_name: data.filmNameCn,
          enter_type: this.env
        })
        if ((data.video.length && /^https?.+\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/i.test(data.video[0].videoUrl))) {
          this.videoUrl = utils.formatUrlProtocol(data.video[0].videoUrl)
          this.player.poster(data.filmHeadImg || data.video[0].videoImg)
          this.player.src(this.videoUrl)
        } else {
          this.imageUrl = data.filmHeadImg || (data.video.length && data.video[0].videoImg)
        }
      }).then(() => {
        this.getActivityBaseInfo(this.type).then(res => {
          let code = this.userCode || utils.getQueryString("ucode")
          this.SHARE_CONFIG({
            title: res.shareTitle,
            desc: res.shareDescription,
            link: `${location.origin}${location.pathname}?ucode=${code || ""}#/movie?filmId=${filmId}&type=${this.type}`,
            img: res.shareImage, // 分享图标
            jsApiList: ["chooseWXPay"]
          })
          this.getTicketStatus(res.id)
        })
      })
    }
  },
  async mounted () {
    window.scrollTo(0, 1)
    const loading = this.$toast.showLoading()
    let filmId = this.$route.query.filmId
    env.browser.inApp && this.CHANGE_SLOGAN_VISIBLE()
    this.needHdc = this.$route.query.needHdc || "activity"
    this.type = this.$route.query.type || ""
    if (env.browser.inApp) {
      this.$windvane.call("SCHYDataInterface.getUserInfo").then(({ data, success }) => {
        if (success && data.u_token) {
          this.$sensors.login(data.u_id)
          this.RECORD_USERINFO(data)
          this.getUserInfo(data.u_id)
        }
      }).catch(() => {}).finally(() => {
        this.init(filmId, loading)
      })
    } else {
      this.init(filmId, loading)
    }
    new CustomEvent("HYBaseEvent_ShareIconTouchEvent")
    window.addEventListener("HYBaseEvent_ShareIconTouchEvent", this.appShareIconClick)
  },
  beforeDestroy () {
    window.removeEventListener("HYBaseEvent_ShareIconTouchEvent", this.appShareIconClick)
  }
}
</script>

<style lang="scss" scoped>
.detail {
  background: rgba(247, 247, 247, 1);
  min-height: 100vh;
  padding-bottom: rem(80);
  .header{
    img{
      display: block;
      width: 100%;
    }
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
  .buttons{
    position: fixed;
    bottom: rem(30);
    width: rem(345);
    left: 0;
    right: 0;
    margin: auto;
    z-index: 10;
    @include flex();
    .b-button{
      flex:1;
      height: rem(44);
      line-height: rem(44);
      border-radius:rem(22);
      font-size:rem(16);
      font-weight:500;
      background:rgba(204,140,68,1);
      color: #ffffff;
      margin: 0 auto;
      text-align: center;
      &--single{
        background: linear-gradient(135deg, #FEF3BD 0%, #F3CF8A 100%);
        margin-right: rem(9);
        color: #594B34;
      }
      &--pack{
        background: linear-gradient(135deg, #DA3D2B 0%, #CD3726 100%);
      }
    }
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
