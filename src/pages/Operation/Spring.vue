<template>
  <section :class="{'spring':true,'ruleShow':ruleCover}">
    <div class="rule-btn" @click="ruleCoverClickHandle">活动规则</div>
    <div class="comment">
      <img :src="basicData.bannerImage" />
    </div>
    <div v-if="slideList.length">
      <swiper class="swiper-container swiper-no-swiping" :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
        <swiper-slide v-for="(item,index) in slideList" :key="index">
          <p>{{item}}</p>
        </swiper-slide>
      </swiper>
    </div>
    <div class="list" v-if="dataList">
      <div class="item" v-for="item in dataList" :key="item.filmId" @click.stop="toDetailPage(item)" >
        <div class="thumb">
          <img :src="`${item.imageUrl}`" alt/>
        </div>
        <div class="info">
          <div class="name">{{item.filmName}}</div>
        </div>
        <div class="btn">
          <button v-if="basicData.id && basicData.showStatus" :class="{disable: item.ticketStatus===2 &&item.ticketNo }" @click.stop="onItemClicked(item)">去观影</button>
          <button v-if="basicData.id && !basicData.showStatus" class="disable" >活动已结束</button>
        </div>
      </div>
    </div>
    <!-- 规则 -->
    <section class="rule-container" @click.self="ruleCover = false" v-if="ruleCover">
      <article class="rule-wrapper">
        <section class="rule">
          <div class="rule-box">
            <h2><span class="title">活动规则</span></h2>
            <article class="context-container">
              <section class="context-wrapper">
                <p class="subtitle">【活动时间】</p>
                <p>2020年2月8日-2月28日</p>
                <p class="subtitle">【核心玩法】</p>
                <p> 年年有余： 1元购票观影，必抽中价值1.01元-88.88元的积分红包（可提现）。</p>
                <p> 福运连连：完成观影任务，有机会抽取价值“2021元”的积分大奖（可提现）。</p>
                <p> 瓜分新人礼：邀请新用户参与“年年有余”活动可获取随机奖励，最高188积分（可提现）。</p>
                <p class="subtitle">【活动规则】</p>
                <p>年年有余，必赚不赔： 1元购票观影，必抽中价值1.01元-88.88元的积分红包。</p>
                <p>1.本环节每位用户每天最多可抽10次奖；</p>
                <p>2.每购1张票并参与观影，可获得1次年年有余抽奖机会；</p>
                <p>3.观影时，点击观影页面的抽奖按钮，即可参与年年有余抽奖。</p>
                <p>4.当天的10次抽奖机会于当天23:59:59清零，并更新为第2天的10次抽奖机会；</p>
                <p>福运连连：深度观影，有机会抽取价值“2021元”的积分大奖。</p>
                <p>1.每位用户每天最多获取1次福运连连抽奖机会。</p>
                <p>2.当天观看2部影片均超过15分钟，获得1次福运连连抽奖机会；</p>
                <p>3.需在完成观影任务的第2天0-24点参与抽奖，未到时间不可抽取，过期作废；</p>
                <p>瓜分新人礼：邀请新用户参与年年有余活动，可获取随机积分奖励，最高188积分。</p>
                <p>1.被邀请的新用户必须完成“1元购票并观影“行为，邀请人才可以获得积分；</p>
                <p>2.被邀请的用户及用户手机号必须未曾注册过移动电影院帐号；；</p>
                <p class="subtitle">【积分提现】</p>
                <p>每位用户每天仅限提现1次：</p>
                <p>1.提现说明：下载移动电影院App-登录账号-【我的】-【我的积分】-【积分提现】-【绑定支付账户】-【提现至微信红包】；</p>
                <p>2.用户积分≥100即可提现，积分按100的整数倍提取，如333积分提现3元整，账户剩余33积分；</p>
                <p>3.提交申请后1-3个工作日内即可到账；</p>
                <p>4.用户申请积分提现后，会以微信转账方式发放到用户绑定的微信零钱账户中。</p>
                <p class="subtitle">【活动规则&注意】</p>
                <p>1.仅限活动期间按规则参与活动的用户可获得奖励；</p>
                <p>2.仅限凭本活动内电影票观影的用户获得抽奖机会，未使用在本活动页面购买的电影票观影，不参与本活动；</p>
                <p>3.购票后请在当天及时观影，只购票不使用活动电影票观影，无抽奖机会；</p>
                <p>4.同1部影片未看完，点击“重新参与“活动会将已有本影片的电影票核销，需重新购票参与；</p>
                <p>5.用户必须绑定微信支付才可以提现，且同一个微信只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
                <p>6.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
                <p>7.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
                <p>8.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
                <p>9.依据相关法律法规要求，平台向您支付积分提现奖励时需履行代扣代缴义务；您参与此次活动就表示同意并知晓纳税义务，如相关报酬需依法申报缴纳相关税款，平台将根据国家税务法规要求向税务机关提供必要的税务申报信息（包括您的身份信息、报酬金额等税务机关要求的信息），并由平台依法为您完成相关的纳税申报。</p>
                <p>*本活动最终解释权归移动电影院所有</p>
              </section>
            </article>
          </div>
        </section>
        <p class="close" @click="ruleCover = false"></p>
      </article>
    </section>
    <div class="luckyDraw" @click="toLuckyDraw"></div>
    <sc-confirm :closable="true" confirmTitle="提示" msgColor="#666666" cancelTextColor="#E8BF8F" confirmTextColor="#999999" :confirmVisiable="confirmShow" :msg="allowable? `影片未看完，请选择继续观影或重新购票参与活动<span style='color:#EF1919;'>（该影片已有的票将被核销）</span>` :'今日抽奖机会已用完'" cancelText="继续观影" :confirmText="allowable?'重新购票': '明日参与'" @cancel="cancleHandle" @confirm="confirmHandle" @close="confirmShow = false"></sc-confirm>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import ScConfirm from "@/components/ScConfirm"
import utils from "@/common/scripts/utils"
import axios from "@sc/lib-axios"
import env from "@sc/lib-env"
export default {
  components: {
    ScConfirm
  },
  data () {
    return {
      ruleCover: false,
      inApp: env.browser.inApp,
      dataList: [],
      openType: "drawer",
      basicData: {},
      activityId: "",
      swiperOption: {
        direction: "vertical",
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        speed: 2000,
        loop: true,
        slidesPerView: "2",
        autoplay: {
          delay: 0,
          stopOnLastSlide: false,
          disableOnInteraction: false
        }
      },
      confirmShow: false,
      slideList: [],
      currentFilm: "",
      sourceList: {
        "banner": "首页banner",
        "pop": "首页霸屏",
        "user": "用户分享"
      },
      allowable: true,
      prizeActivityCode: "",
      timer: ""
    }
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "SHARE_CONFIG", "RECORD_USERCODE"
    ]),
    toDetailPage (item) {
      // eslint-disable-next-line camelcase
      let { skuId, filmName: film_name, filmId } = item
      this.$sensors.track("activity_page_img_click", {
        activity_id: "20210205",
        activity_name: "春节购票观影抽奖活动",
        sku_id: skuId,
        film_name
      }, () => {
        this.$router.push({ name: "detail", query: { filmId, buy: 0, needHdc: "activity", skuId, skip: "spring", code: this.prizeActivityCode } })
      })
    },
    ruleCoverClickHandle () {
      this.$sensors.track("activity_rule_click", {
        activity_id: "20210205",
        activity_name: "春节购票观影抽奖活动"
      }, () => {
        this.ruleCover = true
      })
    },
    async onItemClicked (item) {
      this.currentFilm = item
      let { ticketStatus, spuId, ticketNo, skuId, filmName } = item
      if (ticketStatus === 2) return
      if (ticketNo) {
        if (this.accountInfo.status && this.accountInfo.status === 2) {
          this.$toast.showToast("您的账号存在异常，无法参加本次活动")
          return
        }
        this.confirmShow = true
      } else {
        if (!this.login && env.browser.inApp) {
          let v = navigator.userAgent.match(/SmartCinema\/([0-9]+.[0-9]+.[0-9]+)/)[1]
          if (this.openType === "poplayer" && env.os.ios && !utils.versionComparenavigator(v, "3.0.5")) {
            this.$toast.showToast("请登录后参与本活动")
            setTimeout(() => {
              this.$windvane.call("SCHYPoplayerInterface.closePoplayer")
            }, 2000)
          } else {
            this.$windvane.call("SCHYUIInterface.showLoginPage")
          }
        } else {
          if (this.accountInfo.status && this.accountInfo.status === 2) {
            this.$toast.showToast("您的账号存在异常，无法参加本次活动")
            return
          }
          this.$sensors.track("activity_page_buy", {
            activity_id: "20210205",
            activity_name: "春节购票观影抽奖活动",
            sku_id: skuId,
            film_name: filmName
          })
          this.$router.push({ name: "pay", query: { spuId, needHdc: "activity", skip: "spring", skuId } })
        }
      }
    },
    listFetch () {
      return this.$services.operation.getActivityFilms({ type: "newYearFilm", activityId: this.activityId }).then(res => {
        this.dataList = res
        this.prizeActivityCode = res[0].prizeActivityCode
      })
    },
    toMoviePlayPage (ticketNo, filmId) {
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
    },
    setShare (code = "", activityId = "", shareInfo = {}) {
      let url = `${location.origin + location.pathname}?ucode=${code}${location.hash}${location.hash.indexOf("?") > 0 ? "&" : "?"}${!this.$route.query.activityId ? "activityId=" + activityId : ""}&source=user`
      this.SHARE_CONFIG({
        title: shareInfo.shareTitle,
        desc: shareInfo.shareDescription,
        link: url,
        img: shareInfo.shareImage, // 分享图标
        jsApiList: ["chooseWXPay"]
      })
    },
    async getBaseInfo (uid) {
      let codePromise = utils.to(this.$services.user.getuserCode({ "X-User-Id": uid }))
      let pointsPromise = utils.to(this.$services.user.getUserPoints({ "X-User-Id": uid }))
      let [codeErr, codeData] = await codePromise
      let [pointstErr, pointsData] = await pointsPromise
      if (!codeErr) {
        this.setShare(codeData.code, this.activityId, this.basicData)
        this.RECORD_USERCODE(codeData.code)
      }
      !pointstErr && this.RECORD_POINTS(pointsData)
    },
    cancleHandle () {
      let { ticketNo, filmId, skuId } = this.currentFilm
      // 继续观影
      env.browser.inApp ? this.toMoviePlayPage(ticketNo, filmId) : this.$router.push({ name: "detail", query: { filmId, buy: 0, needHdc: "activity", skuId, skip: "spring", code: this.prizeActivityCode } })
      this.confirmShow = false
    },
    async confirmHandle () {
      if (!this.allowable) {
        this.confirmShow = false
        return
      }
      let { ticketNo, playProgress, spuId, skuId } = this.currentFilm
      // 重新参与活动
      await utils.to(this.$services.home.filmProgressUpload({ ticketNo, playProgress, reportType: 4 }))
      this.confirmShow = false
      this.$router.push({ name: "pay", query: { spuId, needHdc: "activity", skip: "spring", skuId } })
    },
    async getRankList () {
      let [err, data] = await utils.to(this.$services.operation.getNewYearRank())
      if (!err) {
        this.slideList = data.splice(data.length - 2).concat(data)
      }
    },
    toLuckyDraw () {
      this.$sensors.track("activity_page_lottery_click", {
        activity_id: "20210205",
        activity_name: "春节购票观影抽奖活动"
      })
      if (!env.browser.inApp) {
        this.$callapp.gotoPage({
          pathname: "web",
          params: {
            stringUrl: encodeURIComponent(`${location.origin}/index.html#/operation/spring?source=banner`)
          }
        })
      } else {
        this.login ? this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL: this.basicData.jumpLink }) : this.$windvane.call("SCHYUIInterface.showLoginPage")
      }
    },
    async getPrizeDetail (code) {
      if (!code) return
      let [prizeErr, prizeData] = await utils.to(this.$services.operation.getLotteryDetail({ code }))
      !prizeErr && (this.allowable = !!prizeData.allowable)
    },
    appShareIconClick () {
      this.$sensors.track("activity_page_share_click", {
        activity_id: "20210205",
        activity_name: "春节购票观影抽奖活动"
      })
    }
  },
  computed: {
    ...mapState([
      "login", "accountInfo", "userCode"
    ])
  },
  async created () {
    this.activityId = this.$route.query.activityId || ""
    this.openType = this.$route.query.openType || this.openType
    let [basicErr, basicData] = await utils.to(this.$services.operation.getActivityBasic({ type: "newYearFilm", activityId: this.activityId }))
    if (!basicErr) {
      this.basicData = basicData
      this.setShare(this.userCode, basicData.id, basicData)
    } else {
      this.setShare()
      this.$toast.showToast(basicErr.msg)
      return
    }
    if (env.browser.inApp) {
      this.$windvane.call("SCHYDataInterface.getUserInfo").then(({ data, success }) => {
        if (success && data.u_token) {
          this.$sensors.login(data.u_id)
          this.RECORD_USERINFO(data)
          axios.setUserToken(data.u_token)
          this.getBaseInfo(data.u_id)
        }
        this.listFetch().then(() => {
          this.login && this.getPrizeDetail(this.prizeActivityCode)
        }).catch(e => {
          console.log(`error:${e}`)
        })
      }).catch(() => {
        this.listFetch()
      })
    } else {
      this.listFetch().then(() => {
        this.login && this.getPrizeDetail(this.prizeActivityCode)
      })
    }
    this.$sensors.track("activity_page_enter", {
      activity_id: "20210205",
      activity_name: "春节购票观影抽奖活动",
      source_user_code: utils.getQueryString("ucode") || "",
      page_source: this.sourceList[this.$route.query.source] || ""
    })
    this.getRankList()
    this.timer = setInterval(() => {
      this.getRankList()
    }, 60000)
    new CustomEvent("HYBaseEvent_ShareIconTouchEvent")
    window.addEventListener("HYBaseEvent_ShareIconTouchEvent", this.appShareIconClick)
  },
  beforeDestroy () {
    console.log("destory")
    clearInterval(this.timer)
    window.removeEventListener("HYBaseEvent_ShareIconTouchEvent", this.appShareIconClick)
  }
}
</script>

<style lang="scss" scoped>
.spring {
  background: url(https://g.smartcinema.com.cn/images/66c317d3ee72467b9e5adb366112f276-750-301.png) left bottom no-repeat;
  // background: url(https://g.smartcinema.com.cn/images/f932b55ce179436984932eccf668e2e3-1035-4845.jpg) left bottom no-repeat;
  background-size: rem(375) rem(150);
  background-color:#fe1d09;
  padding-bottom: rem(140);
  min-height: 100vh;
  padding-top: rem(0.1);
  &.ruleShow{
    width: 100%;
    position: fixed;
  }
  .comment{
    width: 100%;
    // margin: rem(20) auto 0;
    img{
      width: 100%;
      height: auto;
      object-fit: cover;
      display: block;
    }
  }
  .swiper-container{
    display: inline-block;
    height: rem(80);
    margin: rem(-30) 0 0;
    font-size: 0;
    .swiper-slide-duplicate{
      opacity: 1;
      transition: opacity 3s;
    }
    .swiper-slide{
      opacity: 0;
      height: rem(40) !important;
    }
    .swiper-slide-prev{
      opacity: 0;
      height: rem(40) !important;
    }
    .swiper-slide-active{
      opacity: 0;
      transition: opacity 3s;
    }
    .swiper-slide-next{
      opacity: 1;
      transition: opacity 3s;
    }
    p{
      display: inline-block;
      // width: rem(193);
      height: rem(30);
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 rem(2) rem(10) 0 rgba(0, 0, 0, 0.1);
      border-radius: 0 rem(15) rem(15) 0;
      font-size: rem(15);
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      color: #000000;
      line-height: rem(30);
      text-align: center;
      padding: rem(0) rem(19) rem(0) rem(16);
      margin-bottom: rem(15);
    }
  }
  .list {
    overflow: hidden;
    margin-left: rem(15);
    margin-top: rem(10);
    .item {
      position:relative;
      float: left;
      margin-right: rem(7);
      margin-bottom: rem(15);
      width: rem(168);
      overflow: hidden;
      background:#cb1000;
      border-radius: rem(6);
      border: rem(1) #fff7e6 solid;
      font-size: 0;
      .thumb {
        width: rem(168);
        height: rem(232);
        background: #666;
        overflow: hidden;

        img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .info {
        padding: 0 rem(10);
        margin:rem(12) auto rem(10);
        box-sizing: border-box;
        @include flex($jus:center);
        // height: rem(42);
        .name {
          font-family:PingFangSC-Semibold,PingFang SC;
          letter-spacing: rem(0.51);
          font-size: rem(15);
          font-weight: 600;
          color:rgba(216,216,216,1);
          line-height: rem(21);
          text-align: center;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .btn{
        padding: 0 rem(10) rem(10);
        button{
          display: block;
          width:rem(146);
          height:rem(33);
          background:url(https://g.smartcinema.com.cn/images/7f0d2c12935c4449ad56a8477a204e63-292-65.png) 0 0 no-repeat;
          background-size: rem(146) rem(33);
          border-radius:rem(2);
          font-size:rem(0);
          font-family:PingFangSC-Semibold,PingFang SC;
          font-weight:600;
          color: #40373E;
        }
        .disable{
          background: rgba(102, 102, 102, 1);
          color: rgba(153, 153, 153, 1);
        }
      }
    }
  }
  .rule-btn{
    position: absolute;
    right: 0;
    top: rem(30);
    width: rem(27);
    height: rem(70);
    background:url(https://g.smartcinema.com.cn/images/bf54ce8240bc42ccb49a9427cbe3f92e-108-278.png);
    background-size: 100% 100%;
    font-size:rem(12);
    font-weight:700;
    color:rgba(108,51,0,1);
    line-height:rem(14);
    writing-mode:vertical-lr;
    @include flex($jus:center);
  }
  .luckyDraw{
    position: fixed;
    right: rem(14);
    bottom: rem(54);
    width: rem(74);
    height: rem(74);
    background: url(https://g.smartcinema.com.cn/images/00e295a148f04fcdadce57a6dc72156a-148-148.png) 0 0 no-repeat;
    background-size: cover;
    animation: button-animation 1000ms linear infinite;
  }
  @keyframes button-animation {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100%{
      transform: scale(1);
    }
  }
}
</style>
