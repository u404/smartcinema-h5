<template>
  <h5-loading-panel v-if="loading"></h5-loading-panel>
  <div v-else :class="{'bp':true,'ruleShow':ruleCover}">
    <div class="rule-btn" @click="ruleCoverClickHandle">活动规则</div>
    <div class="comment">
      <img :src="basicData.bannerImage" />
    </div>
    <div class="list" v-if="listData">
      <div class="item" v-for="item in listData" :key="item.filmId" @click.stop="onItemClicked(item, 'detail')" >
        <div class="thumb">
          <img :src="`${item.imageUrl}`" alt/>
        </div>
        <div class="info">
          <div class="name">{{item.filmName}}</div>
        </div>
        <div class="btn">
          <button v-if="basicData.id && basicData.showStatus" @click.stop="onItemClicked(item)">去观影</button>
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
                <p>2021年7月1日-8月1日</p>
                <p class="subtitle">【活动1：献礼百年】</p>
                <p>奖品设置：积分奖励（可提现）、中国国家博物馆党史年志、豆瓣电影日历、“为人民服务”搪瓷杯、中国国家博物馆礼品袋（中号）</p>
                <p>核心玩法：每天免费看10部经典电影，观影3分钟可抽奖</p>
                <p>活动规则：</p>
                <p>1.活动期间每天均可免费观影，观影次数不限；</p>
                <p>2.当用户参与活动天数≤5天（当天有抽奖行为即算作参与1天），每天默认有3次抽奖机会，观影3分钟即可抽奖；</p>
                <p>3.当用户参与活动天数>5天（当天有抽奖行为即算作参与1天），每天无默认抽奖机会，需邀请新用户观影增加抽奖机会；</p>
                <p>4.在App活动页内观影达3分钟，点击观影页面的抽奖按钮，即可参与抽奖（仅限App内可参与抽奖）；</p>
                <p>5.抽中实物奖品后在我的-卡券（其他）-去使用-输入寄送信息，工作人员会在活动结束后陆续寄送奖品；</p>
                <p>6.影片当天有效，过期可重新观看。</p>
                <p class="subtitle">【活动2：经典流传】</p>
                <p>经典相传：邀请新用户在本活动内观影，可得积分奖励</p>
                <p>活动规则：</p>
                <p>1.被邀请的新用户必须当天在活动中有观影行为，邀请人才可以获得积分；</p>
                <p>2.每位用户每天仅限成功邀请前6位时获得积分及抽奖机会，奖励依次为：66积分+1次抽奖机会、66积分+1次抽奖机会、88积分+1次抽奖机会、108积分+1次抽奖机会、128积分+1次抽奖机会、268积分+1次抽奖机会。</p>
                <p>3.被邀请的用户及用户手机号必须未曾注册过移动电影院帐号；</p>
                <p>4.累计瓜分20,000,000积分，瓜分完毕后本活动环节结束。</p>
                <p class="subtitle">【积分提现】</p>
                <p>每位用户每天仅限提现1次：</p>
                <p>1.提现说明：下载移动电影院App-登录账号-【我的】-【我的积分】-【积分提现】-【绑定支付账户】-【提现至微信红包】；</p>
                <p>2.用户积分≥100即可提现，积分按100的整数倍提取，如333积分提现3元整，账户剩余33积分；</p>
                <p>3.提交申请后1-5个工作日内即可到账；</p>
                <p>4.用户申请积分提现后，会以微信转账方式发放到用户绑定的微信零钱账户中。</p>
                <p class="subtitle">【活动规则&注意】</p>
                <p>1.仅限活动期间，按规则参与活动的用户获得奖励；</p>
                <p>2.仅限凭本活动内观影3分钟的用户获得抽奖机会，非在本活动页观看影片，不参与本活动；</p>
                <p>3.观影未达3分钟，无抽奖机会，参与活动超过5天，只能通过邀请新人观影获得抽奖机会；</p>
                <p>4.用户必须绑定微信支付才可以提现，同一个微信、同一用户只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
                <p>5.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
                <p>6.基于保护用户权益的考虑，移动电影院会对您的帐号进行风险检测，对于高风险用户，移动电影院有权对您的帐号进行冻结处理。如有问题，请联系移动电影院客服。</p>
                <p>7.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
                <p>8.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
                <p>9.依据相关法律法规要求，平台向您支付积分提现奖励时需履行代扣代缴义务；您参与此次活动就表示同意并知晓纳税义务，如相关报酬需依法申报缴纳相关税款，平台将根据国家税务法规要求向税务机关提供必要的税务申报信息（包括您的身份信息、报酬金额等税务机关要求的信息），并由平台依法为您完成相关的纳税申报。</p>
                <p>*本活动最终解释权归移动电影院所有</p>
              </div>
            </article>
          </div>
        </div>
        <p class="close" @click="ruleCover = false"></p>
      </article>
    </div>
  </div>
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
      listData: [],
      openType: "drawer",
      basicData: {},
      activityId: "",
      currentFilm: "",
      sourceList: {
        "banner": "首页banner",
        "pop": "首页霸屏",
        "user": "用户分享"
      },
      loading: true,
      type: "qiyihundred"
    }
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "SHARE_CONFIG", "RECORD_USERCODE"
    ]),
    // 销票
    clearTicket (ticketNo, playProgress) {
      return this.$services.home.filmProgressUpload({ ticketNo, playProgress, reportType: 4 }).catch(err => {
        this.$toast.showToast(err.msg)
      })
    },
    // 0元支付，直接购买
    directPay (skuId) {
      return this.$services.order.directPay({ skuId, buyNumber: "1", payType: 0 }).catch(err => {
        this.$toast.showToast((err && err.msg) || "抢票失败，请重试")
        throw new Error()
      })
    },
    // 抢票成功
    directPaySuccess (data) {
      const { paymentResponseDTO: { filmId, tickets } } = data
      this.listFetch(this.type, this.activityId).then((res) => {
        this.listData = res
        this.toMoviePlayPage(tickets[0], filmId)
      })
    },
    ruleCoverClickHandle () {
      this.$sensors.track("activity_rule_click", {
        activity_id: "20210701",
        activity_name: " 七一建党百年活动"
      }, () => {
        this.ruleCover = true
      })
    },
    async onItemClicked (item, target = "play") {
      this.currentFilm = item
      let { filmId, skuId, filmName, ticketNo, todayTicket } = item
      if (target === "detail") {
        this.$sensors.track("activity_page_img_click", {
          activity_id: "20210701",
          activity_name: " 七一建党百年活动",
          sku_id: skuId,
          film_name: filmName
        })
      }
      if (this.accountInfo.status && this.accountInfo.status === 2) {
        this.$toast.showToast("您的账号存在异常，无法参加本次活动")
        return
      }
      if (this.login) {
        const loading = this.$toast.showLoading()
        if (ticketNo) {
          if (!todayTicket) {
            const { ticketNo, playProgress } = item
            await this.clearTicket(ticketNo, playProgress)
          } else {
            this.$nextTick(() => {
              this.$toast.close(loading)
            })
            target === "play" ? this.toMoviePlayPage(ticketNo, filmId) : this.$router.push({ name: "detail", query: { filmId, buy: 0, needHdc: "activity", skuId, skip: "hundred" } })
            return
          }
        }
        this.directPay(skuId).then(res => {
          target === "play" ? this.directPaySuccess(res) : this.$router.push({ name: "detail", query: { filmId, buy: 0, needHdc: "activity", skuId, skip: "hundred" } })
        }).catch(err => {
          this.$toast.showToast(err.msg)
        }).finally(() => {
          this.$toast.close(loading)
        })
      } else {
        if (env.browser.inApp) {
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
            activity_id: "20210701",
            activity_name: " 七一建党百年活动",
            sku_id: skuId,
            film_name: filmName
          })
          this.$router.push({ name: "login", query: { redirect: "/operation/qiyihundred" } })
        }
      }
    },
    listFetch (type, activityId) {
      return this.$services.operation.getActivityFilms({ type, activityId }).catch((err) => {
        this.$toast.showToast(err.msg)
      })
    },
    toMoviePlayPage (ticketNo, filmId) {
      if (this.inApp) {
        const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
        env.browser.inApp ? this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL }) : this.$router.push({ name: "play", query: { filmId, ticketNo } })
      } else {
        this.$router.push({ name: "play", query: { filmId, ticketNo } })
      }
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
    appShareIconClick () {
      this.$sensors.track("activity_page_share_click", {
        activity_id: "20210701",
        activity_name: " 七一建党百年活动"
      })
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
    }
  },
  computed: {
    ...mapState([
      "login", "accountInfo", "userCode"
    ])
  },
  async created () {
    window.scrollTo(0, 1)
    this.activityId = this.$route.query.activityId || ""
    this.openType = this.$route.query.openType || this.openType
    this.getActivityBaseInfo(this.type, this.activityId)
    if (env.browser.inApp) {
      this.$windvane.call("SCHYDataInterface.getUserInfo").then(({ data, success }) => {
        if (success && data.u_token) {
          this.$sensors.login(data.u_id)
          this.RECORD_USERINFO(data)
          axios.setUserToken(data.u_token)
          this.getBaseInfo(data.u_id)
        }
      }).finally(() => {
        this.listFetch(this.type, this.activityId).then(res => {
          this.listData = res
          this.$nextTick(() => {
            this.loading = false
          })
        })
      })
    } else {
      this.listFetch(this.type, this.activityId).then(res => {
        this.listData = res
        this.$nextTick(() => {
          this.loading = false
        })
      })
    }
    this.$sensors.track("activity_page_enter", {
      activity_id: "20210701",
      activity_name: " 七一建党百年活动",
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
.bp {
  background-color:#BF0707;
  padding-bottom: rem(10);
  min-height: 100vh;
  padding-top: rem(0.1);
  &.ruleShow{
    width: 100%;
    position: fixed;
  }
  .comment{
    width: 100%;
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

  .disable{
    background: #B4B4B4;
    color: #F0F0F0;
    border-radius: rem(24);
  }
}
</style>
