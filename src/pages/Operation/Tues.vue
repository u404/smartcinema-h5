<template>
  <section :class="{'tues':true,'ruleShow':ruleCover}">
    <div class="rule-btn" @click="ruleCoverClickHandle">活动规则</div>
    <div class="comment">
      <img :src="basicData.bannerImage" />
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
          <button v-if="basicData.id && basicData.showStatus" :class="{disable: item.ticketStatus===2 &&item.ticketNo }" @click.stop="onItemClicked(item)">{{!item.ticketNo || item.ticketStatus ===2?"购买":"观影"}}</button>
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
                <p>每周二、周四全天</p>
                <p class="subtitle">【盲盒奖品】</p>
                <p> 惊喜盲盒：</p>
                <p> 9900积分-可提现99元现金</p>
                <p> 幸运盲盒（均可提现）：</p>
                <p> 888积分、666积分、168积分、128积分、108积分、100积分、88积分</p>
                <p class="subtitle">【抽盲盒玩法】</p>
                <p> 活动期间，用户付0.99元购票，并进行观影即可抽取盲盒奖品。</p>
                <p>1.每购1张票并进行观影，可获得1次抽盲盒机会；</p>
                <p>2.每部影片每位用户当天仅限购买1张，购买其它影片可继续获得抽盲盒机会；</p>
                <p>3.当天购买的票，仅限当天00:00-23:59:59观影及抽取盲盒，过期影票作废，抽盲盒机会作废。</p>
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
                <p>4.用户必须绑定微信支付才可以提现，且同一个微信、同一用户只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
                <p>5.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
                <p>6.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
                <p>7.基于保护用户权益的考虑，移动电影院会对您的帐号进行风险检测，对于高风险用户，移动电影院有权对您的帐号进行冻结处理。如有问题，请联系移动电影院客服。</p>
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
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import utils from "@/common/scripts/utils"
import axios from "@sc/lib-axios"
import env from "@sc/lib-env"
export default {
  data () {
    return {
      ruleCover: false,
      inApp: env.browser.inApp,
      currentFilmName: "",
      dataList: [],
      openType: "drawer",
      basicData: {},
      activityId: ""
    }
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "SHARE_CONFIG"
    ]),
    toDetailPage (item) {
      this.$sensors.track("activity_page_img_click", {
        activity_id: "20201020",
        activity_name: "周二特价日",
        sku_id: item.skuId,
        film_name: item.filmName
      })
      this.$router.push({ name: "detail", query: { filmId: item.filmId, buy: 0, needHdc: "activity", skuId: item.skuId } })
    },
    ruleCoverClickHandle () {
      this.ruleCover = true
      this.$sensors.track("activity_rule_click", {
        activity_id: "20201020",
        activity_name: "周二特价日"
      })
    },
    async onItemClicked (item) {
      if (item.ticketStatus === 2) {
        return
      }
      if (item.ticketNo) {
        let filmId = item.filmId
        env.browser.inApp ? this.toMoviePlayPage(item.ticketNo, filmId) : this.$router.push({ name: "detail", query: { filmId: item.filmId, buy: 1 } })
      } else {
        let spuId = item.spuId
        if (!this.login && env.browser.inApp) {
          let v = navigator.userAgent.match(/SmartCinema\/([0-9]+.[0-9]+.[0-9]+)/)[1]
          if (this.openType === "poplayer" && env.os.ios && !utils.versionComparenavigator(v, "3.0.5")) {
            this.$toast.showToast("请登录后参与本活动")
            setTimeout(() => {
              this.$windvane.call("SCHYPoplayerInterface.closePoplayer")
            }, 2000)
          } else {
            this.$windvane.call("SCHYUIInterface.showLoginPage", {
              refreshWhenLogin: "0"
            }).then(async ({ data, success }) => {
              if (success) {
                this.$sensors.login(data.u_id)
                this.RECORD_USERINFO(data)
                axios.setUserToken(data.u_token)
                this.listFetch()
                this.getBaseInfo(data.u_id)
              } else {
                this.listFetch()
              }
            }).catch(() => {})
          }
        } else {
          if (this.accountInfo.status && this.accountInfo.status === 2) {
            this.$toast.showToast("您的账号存在异常，无法参加本次活动")
            return
          }
          this.$sensors.track("activity_page_buy", {
            activity_id: "20201020",
            activity_name: "周二特价日",
            sku_id: item.skuId,
            film_name: item.filmName
          })
          this.$router.push({ name: "pay", query: { spuId, needHdc: "activity", skip: "tues", skuId: item.skuId } })
        }
      }
    },
    async listFetch () {
      const loading = this.$toast.showLoading()
      let [err, data] = await utils.to(this.$services.operation.getActivityFilms({ type: "tuesdayFilm", activityId: this.activityId }))
      this.$toast.close(loading)
      if (err) {
        this.$toast.showToast(err.msg)
        return
      }
      this.dataList = data
    },
    toMoviePlayPage (ticketNo, filmId) {
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
    },
    setShare (code = "", activityId = "", shareInfo = {}) {
      let url = this.$route.query.activityId ? location.href : `${location.origin + location.pathname}?ucode=${code}${location.hash}${location.hash.indexOf("?") > 0 ? "&" : "?"}activityId=${activityId}`
      this.SHARE_CONFIG({
        title: shareInfo.shareTitle || "周二特价日，0.99元观影，抽盲盒！",
        desc: shareInfo.shareDescription || "100%中奖，最高99元，本期奖励加大，速来！",
        link: url,
        img: shareInfo.shareImage || "https://g.smartcinema.com.cn/images/f52f6117d6514d4686915c5b01cddfd5-120-120.jpg", // 分享图标
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
      }
      !pointstErr && this.RECORD_POINTS(pointsData)
    }
  },
  computed: {
    ...mapState([
      "login", "accountInfo", "userCode"
    ])
  },
  async created () {
    this.activityId = this.$route.query.activityId || ""
    let [basicErr, basicData] = await utils.to(this.$services.operation.getActivityBasic({ type: "tuesdayFilm", activityId: this.activityId }))
    if (!basicErr) {
      this.basicData = basicData
      this.activityId = basicData.id
      this.setShare(this.userCode, basicData.id, this.basicData)
    } else {
      this.setShare()
      this.$toast.showToast(basicErr.msg)
      return
    }
    this.openType = this.$route.query.openType || this.openType
    if (env.browser.inApp) {
      this.$windvane.call("SCHYDataInterface.getUserInfo").then(async ({ data, success }) => {
        if (success && data.u_token) {
          this.$sensors.login(data.u_id)
          this.RECORD_USERINFO(data)
          axios.setUserToken(data.u_token)
          this.listFetch()
          this.getBaseInfo(data.u_id)
        } else {
          this.listFetch()
        }
      }).catch(() => {
        this.listFetch()
      })
    } else {
      this.listFetch()
    }
    this.$sensors.track("activity_page_enter", {
      activity_id: "20201020",
      activity_name: "周二特价日"
    })
  }
}
</script>

<style lang="scss" scoped>
.tues {
  background-color: rgba(17,17,17,1);
  padding-bottom: rem(30);
  min-height: 100vh;
  padding-top: rem(0.1);
  &.ruleShow{
    width: 100%;
    position: fixed;
  }
  .comment{
    width: rem(345);
    margin: rem(20) auto 0;
    font-size: 0;
    img{
      width: 100%;
      height: auto;
      border-radius: rem(6);
      object-fit: cover;
    }
  }
  .list {
    overflow: hidden;
    margin-left: rem(15);
    margin-top: rem(20);
    .item {
      position:relative;
      float: left;
      margin-right: rem(7);
      margin-bottom: rem(15);
      width: rem(168);
      overflow: hidden;
      background: #1E1E1E;
      border-radius: rem(4);
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
        padding: 0 rem(10) ;
        margin:rem(12) auto rem(10) ;
        box-sizing: border-box;
        @include flex($jus:center);
        height: rem(42);
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
          width:rem(148);
          height:rem(32);
          background:url(https://g.smartcinema.com.cn/images/2ba1b2988d5b4682a33211919095cb1a-296-64.png) 0 0 no-repeat;
          background-size: rem(148) rem(32);
          border-radius:rem(2);
          font-size:rem(16);
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
}
</style>
