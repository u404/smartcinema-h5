<template>
  <!-- <h5-fail-panel v-if="error"></h5-fail-panel> -->
  <!-- <h5-loading-panel v-else-if="loading"></h5-loading-panel> -->
  <div :class="{'dangjian':true,'ruleShow':ruleCover}">
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
          <button v-if="basicData.id && basicData.showStatus" :class="{disable: item.ticketStatus===2 &&item.ticketNo }" @click.stop="onItemClicked(item)">{{item.ticketNo ? "去观影" : "查看"}}</button>
          <button v-if="basicData.id && !basicData.showStatus" class="disable" >活动已结束</button>
        </div>
      </div>
    </div>
    <!-- 规则 -->
    <div class="rule-container" @click.self="ruleCover = false" v-if="ruleCover">
      <article class="rule-wrapper">
        <div class="rule">
          <div class="rule-box">
            <h2><span class="title">活动规则</span></h2>
            <article class="context-container">
              <div class="context-wrapper">
                <p class="subtitle">【活动时间】</p>
                <p>2021年5月9日-6月9日</p>
                <p class="subtitle">【活动1：周年献礼】</p>
                <p>奖品设置：革命老区“红色之旅”名额、超值积分奖励（可提现）</p>
                <p>核心玩法： 1元购票观影或3元打包购票，观影3分钟可抽周年礼</p>
                <p>活动规则：</p>
                <p>1.用户当天购买影片，在App内观影达3分钟，点击观影页面的抽奖按钮，即可参与抽奖（仅限App内可参与抽奖）；</p>
                <p>2.每位用户每天最多可抽3次奖；</p>
                <p>3.仅限当天购买的影片可参与抽奖；</p>
                <p>4.用户所购买的影片，可在活动期间任意时间观影，但每张影票仅限观看1遍影片。</p>
                <p>5.活动结束后，随机抽取3位参与本活动的用户赠送“红色之旅”名额</p>
                <p class="subtitle">【活动2：薪火相传】</p>
                <p>薪火相传：邀请新用户参与周年献礼活动，可得积分奖励</p>
                <p>活动规则：</p>
                <p>1.被邀请的新用户必须当天完成“购票并观影“行为，邀请人才可以获得积分；</p>
                <p>2.每位用户每天仅限成功邀请前6位时获得奖励，积分奖励依次为：108积分、168积分、188积分、288积分、188积分、388积分。</p>
                <p>3.被邀请的用户及用户手机号必须未曾注册过移动电影院帐号；</p>
                <p>4.累计瓜分20000000积分，瓜分完毕后本活动环节结束。</p>

                <p class="subtitle">【积分提现】</p>
                <p>每位用户每天仅限提现1次：</p>
                <p>1.提现说明：下载移动电影院App-登录账号-【我的】-【我的积分】-【积分提现】-【绑定支付账户】-【提现至微信红包】；</p>
                <p>2.用户积分≥100即可提现，积分按100的整数倍提取，如333积分提现3元整，账户剩余33积分；</p>
                <p>3.提交申请后1-3个工作日内即可到账；</p>
                <p>4.用户申请积分提现后，会以微信转账方式发放到用户绑定的微信零钱账户中。</p>
                <p class="subtitle">【活动规则&注意】</p>
                <p>1.仅限活动期间，按规则参与活动的用户获得奖励；</p>
                <p>2.仅限凭本活动内电影票观影的用户获得抽奖机会，未使用在本活动页面购买的电影票观影，不参与本活动；</p>
                <p>3.购票后请及时观影，观影未达3分钟，无抽奖机会；</p>
                <p>4.“红色之旅”出发时间、地点需中奖用户与工作人员沟通后确定；</p>
                <p>5.用户必须绑定微信支付才可以提现，且同一个微信、同一用户只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
                <p>6.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
                <p>7.基于保护用户权益的考虑，移动电影院会对您的帐号进行风险检测，对于高风险用户，移动电影院有权对您的帐号进行冻结处理。如有问题，请联系移动电影院客服。</p>
                <p>8.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
                <p>9.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
                <p>10.依据相关法律法规要求，平台向您支付积分提现奖励时需履行代扣代缴义务；您参与此次活动就表示同意并知晓纳税义务，如相关报酬需依法申报缴纳相关税款，平台将根据国家税务法规要求向税务机关提供必要的税务申报信息（包括您的身份信息、报酬金额等税务机关要求的信息），并由平台依法为您完成相关的纳税申报。</p>
                <p>*本活动最终解释权归移动电影院所有</p>
              </div>
            </article>
          </div>
        </div>
        <p class="close" @click="ruleCover = false"></p>
      </article>
    </div>
    <div :class="{'packBtn': true, disable: (basicData.id && !basicData.showStatus) || (login && !ticketStatus.enableBuyCollection)}" @click.stop="packPurchase">{{buttonText}}</div>
    <sc-confirm :closable="true" confirmTitle="提示" msgColor="#666666" cancelTextColor="#E8BF8F" confirmTextColor="#999999" :confirmVisiable="confirmShow" msg="您所购影片未播放完，请选择继续观影或重新购票参与" cancelText="去观影" confirmText="重新购票参与" @cancel="cancleHandle" @confirm="confirmHandle" @close="confirmShow = false"></sc-confirm>
  </div>
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
      confirmShow: false,
      slideList: [],
      currentFilm: "",
      sourceList: {
        "banner": "首页banner",
        "pop": "首页霸屏",
        "user": "用户分享"
      },
      loading: true,
      ticketStatus: {}
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
        activity_id: "20210509",
        activity_name: "党建专区购票观影抽奖活动",
        sku_id: skuId,
        film_name
      }, () => {
        this.$router.push({ name: "detail", query: { filmId, buy: 0, needHdc: "activity", skuId, skip: "dangjian" } })
      })
    },
    ruleCoverClickHandle () {
      this.$sensors.track("activity_rule_click", {
        activity_id: "20210509",
        activity_name: "党建专区购票观影抽奖活动"
      }, () => {
        this.ruleCover = true
      })
    },
    async onItemClicked (item) {
      this.currentFilm = item
      let { ticketStatus, filmId, ticketNo, skuId, filmName, todayTicket } = item
      if (ticketStatus === 2) return
      if (this.accountInfo.status && this.accountInfo.status === 2) {
        this.$toast.showToast("您的账号存在异常，无法参加本次活动")
        return
      }
      if (ticketNo) {
        if (todayTicket) {
          this.toMoviePlayPage(ticketNo, filmId)
        } else {
          this.confirmShow = true
        }
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
          this.$sensors.track("activity_page_buy", {
            activity_id: "20210509",
            activity_name: "党建专区购票观影抽奖活动",
            sku_id: skuId,
            film_name: filmName
          })
          this.$router.push({ name: "detail", query: { filmId, buy: 0, needHdc: "activity", skuId, skip: "dangjian" } })
        }
      }
    },
    listFetch () {
      return this.$services.operation.getActivityFilms({ type: "dangjian", activityId: this.activityId }).then(res => {
        this.dataList = res
      })
    },
    toMoviePlayPage (ticketNo, filmId) {
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      env.browser.inApp ? this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL }) : this.$router.push({ name: "play", query: { filmId, ticketNo } })
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
      if (this.currentFilm) {
        let { ticketNo, filmId } = this.currentFilm
        // 继续观影
        this.toMoviePlayPage(ticketNo, filmId)
        this.confirmShow = false
        this.currentFilm = ""
      } else {
        this.confirmShow = false
      }
    },
    async confirmHandle () {
      this.$sensors.track("activity_page_re_buy", {
        activity_id: "20210509",
        activity_name: "党建专区购票观影抽奖活动"
      })
      let [err] = await utils.to(this.$services.operation.cancelTickets({ activityId: this.activityId, skuId: this.currentFilm.skuId }))
      if (!err) {
        let { spuId, skuId } = this.currentFilm
        this.confirmShow = false
        this.currentFilm ? this.$router.push({ name: "pay", query: { spuId, needHdc: "activity", skip: "dangjian", skuId } }) : this.$router.push({ name: "pay", query: { skip: "package" } })
        if (!this.currentFilm) {
          this.$sensors.track("activity_page_lottery_click", {
            activity_id: "20210509",
            activity_name: "党建专区购票观影抽奖活动"
          })
        }
        this.currentFilm = ""
      }
    },
    appShareIconClick () {
      this.$sensors.track("activity_page_share_click", {
        activity_id: "20210509",
        activity_name: "党建专区购票观影抽奖活动"
      })
    },
    // 打包购买
    packPurchase () {
      if (env.browser.inApp && !this.login) {
        this.$windvane.call("SCHYUIInterface.showLoginPage")
        return false
      }
      if (!this.basicData.showStatus) {
        return false
      }
      if (this.ticketStatus.enableBuyCollection || !this.login) {
        if (this.ticketStatus.needCancelTicket) {
          this.confirmShow = true
          return
        }
        this.$router.push({ name: "pay", query: { skip: "package" } })
        this.$sensors.track("activity_page_lottery_click", {
          activity_id: "20210509",
          activity_name: "党建专区购票观影抽奖活动"
        })
      }
    },
    getActivityBaseInfo (type, activityId) {
      return this.$services.operation.getActivityBasic({ type, activityId }).then(res => {
        this.basicData = res
        this.activityId = res.id
        this.setShare(this.userCode, res.id, res)
      }).catch((err) => {
        this.setShare()
        this.$toast.showToast(err.msg)
      })
    },
    getTicketStatus (activityId) {
      return this.$services.operation.getTicketState({ activityId }).then(res => {
        this.ticketStatus = res
      }).catch((err) => {
        this.$toast.showToast(err.msg)
      })
    }
  },
  computed: {
    ...mapState([
      "login", "accountInfo", "userCode"
    ]),
    buttonText () {
      return this.basicData.id && !this.basicData.showStatus ? "活动已结束" : this.ticketStatus.enableBuyCollection || !this.login ? "3元看全场" : this.inApp ? "看电影 抽周年礼" : "转到App内观影可抽奖"
    }
  },
  async created () {
    window.scrollTo(0, 1)
    this.activityId = this.$route.query.activityId || ""
    console.log(this.activityId)
    this.openType = this.$route.query.openType || this.openType
    this.getActivityBaseInfo("dangjian", this.activityId)
    this.getTicketStatus(this.activityId)
    if (env.browser.inApp) {
      this.$windvane.call("SCHYDataInterface.getUserInfo").then(({ data, success }) => {
        if (success && data.u_token) {
          this.$sensors.login(data.u_id)
          this.RECORD_USERINFO(data)
          axios.setUserToken(data.u_token)
          this.getBaseInfo(data.u_id)
        }
        this.listFetch().then(() => {
          this.loading = false
        }).catch(e => {
          console.log(`error:${e}`)
        })
      }).catch(() => {
        this.listFetch().then(() => {
          this.loading = false
        })
      })
    } else {
      this.listFetch().then(() => {
        this.loading = false
      })
    }
    this.$sensors.track("activity_page_enter", {
      activity_id: "20210509",
      activity_name: "党建专区购票观影抽奖活动",
      source_user_code: utils.getQueryString("ucode") || "",
      page_source: this.sourceList[this.$route.query.source] || ""
    })
    new CustomEvent("HYBaseEvent_ShareIconTouchEvent")
    window.addEventListener("HYBaseEvent_ShareIconTouchEvent", this.appShareIconClick)
  },
  beforeDestroy () {
    window.removeEventListener("HYBaseEvent_ShareIconTouchEvent", this.appShareIconClick)
  }
}
</script>

<style lang="scss" scoped>
.dangjian {
  background-color:#BF0707;
  padding-bottom: rem(100);
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
          color:#FFECC8;
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
          height:rem(34);
          background:url(https://g.smartcinema.com.cn/images/6ec29cf549ae4e9c866bde9b07bee416-296-68.png) 0 0 no-repeat;
          background-size: rem(148) rem(34);
          border-radius:rem(2);
          font-size: rem(16);
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #A50000;
        }
        .disable{
          background: #B4B4B4;
          color: #F0F0F0;
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
  .packBtn{
    @include flex($jus: center);
    position: fixed;
    left: 0;
    right: 0;
    bottom: rem(30);
    margin: auto;
    width:rem(345);
    height: rem(44);
    background: url(https://g.smartcinema.com.cn/images/d7d4c9b606c74ce6b15e8c45fc42f196-690-88.png) 0 0 no-repeat;
    background-size: cover;
    font-size: rem(16);
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #594B34;
  }
  .disable{
    background: #B4B4B4;
    color: #F0F0F0;
    border-radius: rem(24);
  }
}
</style>
