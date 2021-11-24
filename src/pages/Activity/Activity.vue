<template>
  <section :class="{'activity':true,'ruleShow':(ruleCover || showDialog)}">
    <header>
      <span class="rule-btn" @click="ruleCoverClickHandle">活动规则</span>
    </header>
    <section class="sliderPro">
      <p @click="swiperToPrev"><img src="https://g.smartcinema.com.cn/images/8cb5474f9d294ce19766838ccba577b2-28-28.png" />上一部</p>
      <h5>{{currentFilmName}}</h5>
      <p @click="swiperToNext">下一部<img src="https://g.smartcinema.com.cn/images/8cb5474f9d294ce19766838ccba577b2-28-28.png" /></p>
    </section>
    <section>
      <swiper @slideChangeTransitionEnd="slideChangeEndHandle" class="swiper-container" :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
        <swiper-slide v-for="item in filmList" :key="item.filmId">
          <img class="filmImage" :src="item.imageUrlHor" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </section>
    <section class="info">
      <article>{{filmData.filmHeadDesc}}<span>{{filmData.filmReleaseTime}}</span></article>
      <span></span>
    </section>
    <section class="filmInfo">
      <article class="filmDesc">
        <ellipsis-text ref="eltext" line="5" :content="filmData.introduction"></ellipsis-text>
      </article>
    </section>
    <section class="actor-container">
      <sub-title title="主创人员" />
      <actor-slide :actorData="filmData.performers" />
    </section>
    <section class="photo-container">
      <sub-title title="剧照"  />
      <photo ref="photo" :photos="filmData.photo" />
    </section>
    <v-button :title="filmData.ticketNo?'去观影':'去购票'" @click="filmHandle"></v-button>
    <!-- 规则 -->
    <section class="rule-container" @click="writeMessageFun($event)" v-if="ruleCover">
      <article class="rule-wrapper" ref="msk">
        <section class="rule">
          <h2><span class="title">活动规则</span></h2>
          <article class="context-container">
            <section class="context-wrapper">
              <p class="subtitle">【活动时间】</p>
              <p>即日起-2020年8月28日或累计返现100万元为止，以先到为准。</p>
              <p class="subtitle">【参与流程】</p>
              <p> 活动页选电影——购票——观影返积分——积分提现。</p>
              <p class="subtitle">【活动奖励】</p>
              <p> 每位用户每天仅限观看2部电影返奖励，可直接提现：</p>
              <p>1.每天首次在活动页面观看电影，付0.99元观影后获得399积分，相当于3.99元；</p>
              <p>2.当天在活动页面观看第2部电影，付0.99元观影后获得249积分，相当于2.49元；</p>
              <p>3.当天在活动页面观看第3部及3部以上电影，每部仅获得与电影票相等价值的积分，即99积分。</p>
              <p class="subtitle">【积分提现】</p>
              <p>每位用户每天仅限提现1次，可到移动电影院App提现：</p>
              <p>1.提现说明：下载移动电影院App-登录账号-【我的】-【我的积分】-【积分提现】-【绑定支付账户】-【提现至微信红包】；</p>
              <p>2.用户积分≥100即可提现，积分按100的整数倍提取，如333积分提现3元整，账户剩余33积分；</p>
              <p>3.提交申请后1-3个工作日内即可到账；</p>
              <p>4.用户申请积分提现后，会以微信转账方式发放到用户绑定的微信零钱账户中。</p>
              <p class="subtitle">【活动规则&注意】</p>
              <p>1.仅限活动期间按规则参与活动的用户可获得奖励；</p>
              <p>2.仅限凭本活动电影票观影的用户获得积分奖励，未使用在本活动页面购买的电影票观影，不参与本活动；</p>
              <p>3.购票后请及时观影，只购票不使用活动电影票观影，无积分奖励；</p>
              <p>4.活动截止至活动影片下线前，未观看的电影票仍可使用，但不返还积分及现金；</p>
              <p>5.影片下线后，未使用的电影票作废且不返还积分及现金；</p>
              <p>6.用户必须绑定微信支付才可以提现，提现账号必须实名认证并与微信绑定的身份证保持一致，同一微信只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
              <p>7.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
              <p>8.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
              <p>9.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
              <p>10.依据相关法律法规要求，平台向您支付返现奖励时需履行代扣代缴义务；您参与此次活动就表示同意并知晓纳税义务，如相关报酬需依法申报缴纳相关税款，平台将根据国家税务法规要求向税务机关提供必要的税务申报信息（包括您的身份信息、报酬金额等税务机关要求的信息），并由平台依法为您完成相关的纳税申报。</p>
              <p>*本活动最终解释权归移动电影院所有</p>
            </section>
          </article>
        </section>
        <p class="close" @click="ruleCover = false"></p>
      </article>
    </section>
    <div class="dialog" v-if="showDialog" @click="ticketMessageFun($event)">
      <div class="dialog-inner" ref="tic">
        <p>您已有一张电影票</p>
        <div>
          <span @click="dialogCloseHandle" class="close">结束观影</span>
          <span @click="dialogHandle">继续播</span>
        </div>
      </div>
    </div>
    <div class="dialog" v-if="continueDialog" @click="continueMessageFun($event)">
      <div class="dialog-inner" ref="continue">
        <p>100万现金已瓜分完毕！</p>
        <div>
          <span @click="cancelContinueHandle" class="close">{{ inApp ? "包场赚积分" : "取消" }}</span>
          <span @click="continueHandle">继续购买</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import ActorSlide from "@/components/ActorSlide"
import SubTitle from "@/components/SubTitle"
import EllipsisText from "@/components/EllipsisText"
import Photo from "@/components/Photo"
import VButton from "@/components/VButton"
import utils from "@/common/scripts/utils"
import axios from "@sc/lib-axios"
import env from "@sc/lib-env"
export default {
  components: {
    ActorSlide, EllipsisText, SubTitle, Photo, VButton
  },
  data () {
    return {
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        },
        centeredSlides: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        slidesPerView: "auto"
      },
      filmList: [],
      filmData: {},
      ruleCover: false,
      showDialog: false,
      activeNo: 0,
      totalAmount: 0,
      amount: 0,
      inApp: env.browser.inApp,
      currentFilmName: "",
      continueDialog: false
    }
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "SHARE_CONGIF"
    ]),
    cancelContinueHandle () {
      if (this.inApp) {
        let schemeURL = "smartcinema://createPrivateField?createType=0"
        this.$windvane.call("SCHYUIInterface.closedWebToNativeView", { schemeURL }).then(res => {})
      } else {
        this.continueDialog = false
      }
    },
    continueHandle () {
      this.continueDialog = false
      this.$router.push({ name: "pay", query: { spuId: this.filmData.spuId, needHdc: true } })
    },
    swiperToPrev () {
      this.swiper.slidePrev()
    },
    swiperToNext () {
      this.swiper.slideNext()
    },
    writeMessageFun (ev) {
      if (!this.$refs.msk.contains(ev.target)) {
        this.ruleCover = false
      }
    },
    ticketMessageFun (ev) {
      if (!this.$refs.tic.contains(ev.target)) {
        this.showDialog = false
      }
    },
    continueMessageFun (ev) {
      if (!this.$refs.continue.contains(ev.target)) {
        this.continueDialog = false
      }
    },
    ruleCoverClickHandle () {
      this.ruleCover = true
      this.$sensors.track("activity_rule_click", {
        activity_id: "2020727",
        activity_name: "购票观影返积分活动"
      })
    },
    async dialogCloseHandle () {
      await utils.to(this.$services.home.filmProgressUpload({ ticketNo: this.filmData.ticketNo, playProgress: this.filmData.playProgress, reportType: 4 }))
      this.filmFetch(this.filmData.filmId)
      this.showDialog = false
    },
    dialogHandle () {
      this.filmHandle()
      this.showDialog = false
    },
    slideChangeEndHandle () {
      this.filmFetch(this.filmList[this.swiper.activeIndex].filmId)
      this.activeNo = this.swiper.activeIndex
      this.$refs.photo.$emit("resetHandle")
      this.$refs.eltext.$emit("resetHandle")
      this.currentFilmName = this.filmList[this.activeNo].filmName
      this.$sensors.track("activity_page_img_click", {
        activity_id: "2020727",
        activity_name: "购票观影返积分活动",
        sku_id: this.filmList[this.activeNo].skuId,
        film_name: this.filmList[this.activeNo].filmName
      })
    },
    async filmFetch (filmId) {
      const loading = this.$toast.showLoading()
      let [err, data] = await utils.to(this.$services.home.getFilmDetail({ filmId }))
      this.$toast.close(loading)
      if (err) {
        this.$toast.showToast(err.msg)
        return
      }
      this.filmData = data
      this.currentFilmName = data.filmNameCn
    },
    async filmHandle () {
      if (!this.showDialog && this.filmData.playProgress) {
        this.showDialog = true
        return
      }
      if (this.filmData.ticketNo) {
        let filmId = this.filmList[this.activeNo].filmId
        env.browser.inApp ? this.toMoviePlayPage(this.filmData.ticketNo, filmId) : this.$router.push({ name: "play", query: { ticketNo: this.filmData.ticketNo } })
      } else {
        this.$sensors.track("activity_page_buy", {
          activity_id: "2020727",
          activity_name: "购票观影返积分活动",
          sku_id: this.filmList[this.activeNo].skuId,
          film_name: this.filmData.filmName
        })
        let spuId = this.filmData.spuId
        if (this.login) {
          if (this.accountInfo.status === 2) {
            this.$toast.showToast("您的账号存在异常，无法参加本次活动")
            return
          }
          if (this.filmList[0].status) {
            this.continueDialog = true
            return
          }
          this.$router.push({ name: "pay", query: { spuId, needHdc: true } })
        } else if (!this.login && env.browser.inApp) {
          this.$windvane.call("SCHYUIInterface.showLoginPage", {
            refreshWhenLogin: "0"
          }).then(async res => {
            this.$sensors.login(res.data.u_id)
            let [err, data] = await utils.to(this.$services.user.getuserCode({ "X-User-Id": res.data.u_id }))
            if (!err) {
              let url = `${location.origin + location.pathname}?ucode=${data.code}`
              this.SHARE_CONGIF(url)
            }
            axios.setUserToken(res.data.u_token)
            if (res.success) {
              if (this.filmList[0].status) {
                this.continueDialog = true
                return
              }
              this.$router.push({ name: "pay", query: { spuId, needHdc: true } })
            }
          }).catch(() => {})
        } else {
          this.$router.push({ name: "login" })
        }
      }
    },
    async listFetch () {
      const loading = this.$toast.showLoading()
      let [err, data] = await utils.to(this.$services.home.getActivityFilms({ type: "yunying" }))
      this.$toast.close(loading)
      if (err) {
        this.$toast.showToast(err.msg)
        return
      }
      this.filmList = data
      this.filmList.length && this.filmFetch(this.filmList[0].filmId)
      this.currentFilmName = this.filmList[0].filmName
    },
    toMoviePlayPage (ticketNo, filmId) {
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
    },
    async progressFetch () {
      let [err, data] = await utils.to(this.$services.home.getProgress())
      if (err) return
      this.totalAmount = data.totalAmount
      this.amount = data.amount
    }
  },
  computed: {
    ...mapState([
      "userInfo", "login", "accountInfo", "userCode", "shareInfo"
    ]),
    swiper () {
      return this.$refs.mySwiper.$swiper
    },
    surplusAmount () {
      let num = this.amount / 100
      return (num.toString().indexOf(".") !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,")
    },
    percent () {
      return this.amount / this.totalAmount * 100
    }
  },
  async created () {
    window.location.replace("https://h5.smartcinema.com.cn/tools/activity-end.html")
    this.$sensors.track("activity_page_enter", {
      activity_id: "2020727",
      activity_name: "购票观影返积分活动",
      source_user_code: utils.getQueryString("ucode") || ""
    })
    if (env.browser.inApp) {
      this.$windvane.call("SCHYDataInterface.getUserInfo").then(async (res) => {
        if (res.success && res.data.u_token) {
          this.$sensors.login(res.data.u_id)
          axios.setUserToken(res.data.u_token)
          let [err, data] = await utils.to(this.$services.user.getuserCode({ "X-User-Id": res.data.u_id }))
          if (!err) {
            let url = `${location.origin + location.pathname}?ucode=${data.code}`
            this.SHARE_CONGIF(url)
          }
          [err, data] = await utils.to(this.$services.user.getUserPoints({ "X-User-Id": res.data.u_id }))
          if (!err) {
            this.RECORD_POINTS(data)
          }
          this.RECORD_USERINFO(res.data)
        }
        this.listFetch()
      }).catch(() => {
        this.listFetch()
      })
    } else {
      this.listFetch()
    }
  }
}
</script>

<style lang="scss" scoped>
.activity {
  background-color: rgba(17,17,17,1);
  padding-bottom: getRem375(80);
  &.ruleShow{
    position: fixed;
  }
  header {
    position: relative;
    width: getRem375(375);
    height: getRem375(180);
    background: url(https://g.smartcinema.com.cn/images/89fe8dd7347f48a3a14e55871ea7b057-1500-720.png);
    background-size: 100% 100%;
    .rule-btn{
      position: absolute;
      right: 0;
      top: getRem375(30);
      width: getRem375(27);
      height: getRem375(70);
      background:url(https://g.smartcinema.com.cn/images/bf54ce8240bc42ccb49a9427cbe3f92e-108-278.png);
      background-size: 100% 100%;
      font-size:getRem375(12);
      font-weight:700;
      color:rgba(108,51,0,1);
      line-height:getRem375(14);
      writing-mode:vertical-lr;
      @include flex($jus:center);
    }
  }
  nav {
    width: getRem375(322);
    height: getRem375(54);
    background: url(https://g.smartcinema.com.cn/images/b60fcfe379ee40ba952357b662295cfb-1286-216.png);
    background-size: 100% 100%;
    margin:getRem375(35) auto;
  }
  .sliderPro{
    margin: getRem375(15);
    @include flex();
    p{
      font-size:getRem375(12);
      font-weight:500;
      color:rgba(153,153,153,1);
      line-height:getRem375(17);
      @include flex();
      &:first-of-type{
        img{
          transform: rotate(180deg);
        }
      }
      img{
        width: getRem375(12);
        height: getRem375(12);
      }
    }
    h5{
      font-size:getRem375(16);
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:getRem375(23);
    }
  }
  .progress-container {
    width: getRem375(327);
    height: getRem375(25);
    background: url(https://g.smartcinema.com.cn/images/c0f2603ddf5f4cc9867efe1faf495f00-1308-100.png);
    background-size: 100% 100%;
    margin: auto;
    @include flex();
    .progress{
      display: block;
      width: getRem375(0);
      height:getRem375(18);
      background:url(https://g.smartcinema.com.cn/images/9ae478897cfa44c8bcd30059be29da9a-1276-72.png);
      background-size:auto 100%;
      border-radius:getRem375(18);
      margin: 0 getRem375(4);
      position: relative;
    }
    .progressing{
      &::after {
        content: "";
        display: block;
        width: getRem375(81);
        height: getRem375(23);
        background: url(https://g.smartcinema.com.cn/images/ac41f07b3bb84de1955c040ad381aee7-324-90.png);
        background-size: 100% 100%;
        position: absolute;
        top: getRem375(-3);
        right: getRem375(-30);
      }
    }
  }
  h4{
    margin: getRem375(20) auto getRem375(36);
    text-align: center;
    height:getRem375(23);
    font-size:getRem375(16);
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:getRem375(23);
    letter-spacing:getRem375(1);
    span{
      color: #FBDFAF;
      font-weight: 700;
      font-size: getRem375(20);
      padding: 0 getRem375(2);
    }
  }
  .swiper-container{
    .swiper-slide {
      background-color: rgba(17,17,17,1);
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      transition: 300ms;
      transform: scale(0.9);
      width: getRem375(345) !important;
      .filmImage{
        width: 100%;
        height: getRem375(210);
        border-radius: getRem375(6);
        object-fit: cover;
      }
    }
    .swiper-slide-active,.swiper-slide-duplicate-active{
      transform: scale(1);
    }
    /deep/ .swiper-pagination-bullets{
      height: getRem375(3);
      margin-top: getRem375(15);
      @include flex($jus:center);
      .swiper-pagination-bullet{
        display: block;
        width:getRem375(4);
        height:getRem375(3);
        background:rgba(255,255,255,1);
        opacity:0.7;
        margin: 0 getRem375(4);
      }
      .swiper-pagination-bullet-active{
        width:getRem375(12);
        background:rgba(255,255,255,1);
        opacity:1;
      }
    }
  }
  /deep/ .sub-title{
    margin-bottom: getRem375(12);
    .text{
      text-indent: 0;
      font-size:getRem375(24);
      font-weight:700;
      color:rgba(255,255,255,1);
      line-height:getRem375(34);
      height: getRem375(34);
      &::before{
        display: none;
      }
    }
  }
  /deep/ .button{
    position: fixed;
    bottom: getRem375(30);
    left: 0;
    right: 0;
    margin: auto;
    z-index: 10;
    button{
      height: getRem375(40);
      background: url(https://g.smartcinema.com.cn/images/3882c4e8517142648caa0147b17d5536-1380-160.png);
      background-size: 100% 100%;
      color:rgba(64,55,62,1);
    }
  }
  /deep/ .filmDesc{
    width: getRem375(345);
    margin: auto;
    .ellipsis-content{
      color:rgba(236,236,236,1);
      font-weight: 400;
      text-align: justify;
    }
    .ellipsis-more{
      background-color: rgba(17,17,17,1);
    }
    .ellipsis-fold-text{
      font-size: getRem375(14);
    }
  }
  .actor-container{
    margin-top: getRem375(35);
    /deep/ .name{
      color: #ffffff !important;
      line-height: 1 !important;
      height: getRem375(16) !important;
    }
  }
  .photo-container{
    margin-top: getRem375(50);
  }
  .info{
    width: getRem375(345);
    margin:getRem375(25) auto getRem375(4);
    @include flex();
    article{
      font-size:getRem375(12);
      font-weight:300;
      color:rgba(255,255,255,1);
      line-height:getRem375(17);
      span{
        font-size:getRem375(12);
        line-height:getRem375(14);
        color:rgba(255,49,74,1);
      }
    }
  }
  .rule-container{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.66);
    z-index: 999;
    .rule-wrapper{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .rule{
        width: getRem375(300);
        height: getRem375(432);
        background: #fff;
        border-radius: getRem375(8);
        h2{
          height: getRem375(60);
          border-bottom: #E6E6E6 solid getRem375(1);
          @include flex($jus:center);
          .title{
            height:getRem375(31);
            font-size:getRem375(22);
            font-weight:500;
            color:rgba(108,51,0,1);
            line-height:getRem375(31);
            padding: 0 getRem375(53);
            background: url(https://g.smartcinema.com.cn/images/c08cea1e39f74b51a2dced3e60f3ec0f-152-72.png) 0 center no-repeat, url(https://g.smartcinema.com.cn/images/94e3904ce27f42b6929a53ebdd1007d3-152-72.png) right center no-repeat;
            background-size: getRem375(38) getRem375(18);
          }
        }
        .context-container{
          margin: getRem375(20) getRem375(23) getRem375(14);
          height: getRem375(338);
          overflow: hidden;
          .context-wrapper{
            height: 100%;
            overflow-y: auto;
            text-align: justify;
            p{
              font-size:getRem375(14);
              font-weight:500;
              color:#999999;
              line-height:getRem375(24);
              &.subtitle{
                color: #333333;
              }
            }
          }
        }
      }
      .close{
        margin: getRem375(20) auto 0;
        width: getRem375(30);
        height: getRem375(30);
        background: url(https://g.smartcinema.com.cn/images/bcc537e4bd7c426493cc5440fb992249-120-120.png);
        background-size: 100% 100%;
      }
    }
  }
  .dialog{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    .dialog-inner{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: getRem375(295);
      background: rgba(255,255,255,1);
      border-radius: getRem375(8);
      p{
        padding: getRem375(24) getRem375(22);
        font-size:getRem375(16);
        font-weight:400;
        color:rgba(17,17,17,1);
        line-height:getRem375(24);
        text-align: center;
      }
      div{
        display: flex;
        align-items: center;
        width: 100%;
        height: getRem375(48);
        border-top: getRem375(1) solid rgba(136,136,136,0.28);
        span{
          flex: 1;
          display: flex;
          height: 100%;
          align-items: center;
          justify-content: center;
          font-size:getRem375(16);
          font-weight:500;
          color:rgba(255,49,74,1);
          box-sizing: border-box;
        }
        .close{
          color: rgba(153,153,153,1);
          border-right: getRem375(1) solid rgba(136,136,136,0.28);
        }
      }
    }
  }
}
</style>
