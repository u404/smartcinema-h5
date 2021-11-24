<template>
  <h5-fail-panel v-if="error"></h5-fail-panel>
  <h5-loading-panel v-else-if="loading"></h5-loading-panel>
  <div class="summer-result" v-else-if="!basicData.showStatus">
    <img :src="inApp? 'https://g.smartcinema.com.cn/images/fe42a5b5a1cd4c989e6c70357beec568-750-3378.png': 'https://g.smartcinema.com.cn/images/ba5a55ac173148b48991e2a70d0b6d87-750-3708.png'" />
  </div>
  <div v-else :class="{'summer':true,'ruleShow':ruleCover}">
    <div class="rule-btn" @click="ruleCoverClickHandle">活动规则</div>
    <ActivityBanner :bannerImage="basicData.bannerImage" />
    <div class="banner-share" @click.stop="$router.push({name: 'summer-result'})"></div>
    <div class="content-container">
      <div class="identify-container">
        <div class="lucky-box"></div>
        <div>
          <p class="blod-text">新能源汽车抽奖码：<span>{{codes.length || 1}}个</span></p>
          <p>{{authStatus?"8月31日公布中奖结果":"填写信息才可参与抽奖"}}</p>
        </div>
        <div @click="toIdentify" class="lucky-btn" :class="{'certified': authStatus}"></div>
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
      <div :class="{'packBtn': true, disable: (basicData.id && !basicData.showStatus) || (login && !ticketStatus.enableBuyCollection)}" @click.stop="packPurchase">{{buttonText}}</div>
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
                <p>2021年8月10日-8月31日</p>
                <p class="subtitle">【活动1：新能源汽车抽奖】</p>
                <p>奖品设置：2020款轻松款五菱宏光MINI EV</p>
                <p>活动规则：</p>
                <p>1.须点击【领抽奖码】按钮，填写姓名及身份证号并提交，获限新能源汽车抽奖码；</p>
                <p>2.活动期间，所有用户登录APP即自动领取1个新能源汽车抽奖码，活动期间仅限登录领取1个；</p>
                <p>3.每位用户每天“成功邀请3位新用户在本活动内完成观影行为”，可增加1个新能源汽车抽奖码，每位用户每日最多增加1个抽奖码。</p>
                <p>4.奖品仅限裸车费用，不包含其他任何费用（如牌照、税、保险等），中奖者需自理个人所得税。</p>
                <p>5.8月31日，移动电影院将在所有新能源汽车抽奖码中随机抽取1个号码获得本次奖品新能源汽车一辆，并进行中奖公示，请随时关注。</p>
                <p class="subtitle">【活动2：观影抽福利】</p>
                <p>活动规则：</p>
                <p>1.在App活动页内观影达3分钟，点击观影页面的抽奖按钮，即可参与抽奖（仅限App内可参与抽奖）；</p>
                <p>2.活动期间，用户最多可累积参与5天观影抽奖活动，每天默认有3次抽奖机会，观影3分钟即可抽奖；超过5天，无抽奖机会；</p>
                <p>3.抽中实物奖品后，用户需在中奖页面填写寄送信息，或者返回活动页-我的奖品-卡券包（其他）-去使用-输入寄送信息，工作人员会在活动结束后陆续寄送奖品；</p>
                <p>4.仅限当天购买的影片可参与抽奖；</p>
                <p>5.用户所购买的影片，可在活动期间任意时间观影，但每张影票仅限观看1遍影片。</p>
                <p class="subtitle">【积分提现】</p>
                <p>每位用户每天仅限提现1次：</p>
                <p>1.提现说明：下载移动电影院App-登录账号-【我的】-【我的积分】-【积分提现】-【绑定支付账户】-【提现至微信红包】；</p>
                <p>2.用户积分≥100即可提现，积分按100的整数倍提取，如333积分提现3元整，账户剩余33积分；</p>
                <p>3.提交申请后1-5个工作日内即可到账；</p>
                <p>4.用户申请积分提现后，会以微信转账方式发放到用户绑定的微信零钱账户中。</p>
                <p class="subtitle">【活动规则&注意】</p>
                <p>1.仅限活动期间，按规则参与活动的用户获得奖励；</p>
                <p>2.页面展示奖品仅为示意图，可能进行微调。移动电影院保留对本次活动的最终解释权。</p>
                <p>3.新能源汽车抽奖活动奖品仅限裸车费用，不包含其他任何费用（如牌照、税、保险等），中奖者需自理个人所得税；</p>
                <p>4.新能源汽车抽奖活动抽出中奖者后，将根据抽奖码-姓名-手机号-身份证号进行身份验证，如中奖者实际身份不符合所填写身份信息，移动电影院有权收回奖品；</p>
                <p>5.如移动电影院根据中奖者填写的信息无法联系到中奖者本人，超过1个月，移动电影院将有权收回奖品；</p>
                <p>6.本活动中的新能源汽车奖品为价值不超过28800元的2020款轻松款五菱宏光MINI EV，活动结束后将与中奖者联系，优先在中奖者附近的经销商提车，如遇本车停售，或无牌照等情况，共同协商其他替代方案为准；</p>
                <p>7.仅限凭本活动内观影3分钟的用户获得积分、周边抽奖机会，非在本活动页观看影片，不参与本活动；</p>
                <p>8.观影未达3分钟，无积分、周边抽奖机会，参与活动超过5天，无积分、周边抽奖机会；</p>
                <p>9.用户必须绑定微信支付才可以提现，同一个微信、同一用户只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
                <p>10.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
                <p>11.基于保护用户权益的考虑，移动电影院会对您的帐号进行风险检测，对于虚拟帐号等高风险用户，移动电影院有权对您的帐号进行冻结处理。如有问题，请联系移动电影院客服。</p>
                <p>12.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
                <p>13.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
                <p>14.依据相关法律法规要求，平台向您支付积分提现奖励时需履行代扣代缴义务；您参与此次活动就表示同意并知晓纳税义务，如相关报酬需依法申报缴纳相关税款，平台将根据国家税务法规要求向税务机关提供必要的税务申报信息（包括您的身份信息、报酬金额等税务机关要求的信息），并由平台依法为您完成相关的纳税申报。</p>
                <p>*本活动最终解释权归移动电影院所有</p>
              </div>
            </article>
          </div>
        </div>
        <p class="close" @click="ruleCover = false"></p>
      </article>
    </div>
    <!-- 抽奖码 -->
    <div class="code-container" v-show="codeCover">
      <div class="code-box">
        <div class="code-box-close" @click="closeCover"></div>
        <div class="code-box-title">我的抽奖码</div>
        <div class="code-list-box">
          <div class="code-list">
            <div class="code-item" v-for="item in codes" :key="item.code">
              <div class="code-detail">
                <img :src="item.type === '登录' ? 'https://g.smartcinema.com.cn/images/2640f2ad972b41268397a8ce5646d5cb-84-84.png' :'https://g.smartcinema.com.cn/images/eb1d8acd22d546188b67f8333f52682c-84-84.png'" />
                <div class="code-info">
                  <p class="code-source">{{item.type}}</p>
                  <p class="code-time">{{new Date(item.time.replace(/-/g, "/")).format("yyyy.MM.dd hh:mm")}}</p>
                </div>
              </div>
              <div class="code">{{item.code}}</div>
            </div>
            <div class="code-more">—— 暂无更多 ——</div>
          </div>
        </div>
        <div class="share-btn">
          <button @click.stop="shareHandle">去邀请</button>
        </div>
      </div>
    </div>
    <sc-confirm :closable="true" confirmTitle="提示" msgColor="#666666" cancelTextColor="#E8BF8F" confirmTextColor="#999999" :confirmVisiable="confirmShow" msg="您所购影片未播放完，请选择继续观影或重新购票参与" cancelText="去观影" confirmText="重新购票参与" @cancel="cancleHandle" @confirm="confirmHandle" @close="confirmShow = false"></sc-confirm>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex"
import ScConfirm from "@/components/ScConfirm"
import ActivityBanner from "@/components/ActivityBanner"
import utils from "@/common/scripts/utils"
import axios from "@sc/lib-axios"
import env from "@sc/lib-env"
export default {
  components: {
    ScConfirm, ActivityBanner
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
      ticketStatus: {},
      authStatus: 0,
      codes: [],
      type: "summer2021",
      codeCover: false,
      activity_name: "暑期购票观影抽电动车活动",
      shareData: {}
    }
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "SHARE_CONFIG", "RECORD_USERCODE"
    ]),
    shareHandle () {
      env.browser.inApp ? this.$windvane.call("SCHYUIInterface.openShareWindow", { shareData: this.shareData }) : this.$shareCover().show()
    },
    toIdentify () {
      if (!this.authStatus) {
        this.$sensors.track("activity_go_auth", {
          activity_id: "20210806",
          activity_name: this.activity_name
        }, () => {
          this.$router.push({ name: "identify", query: { id: this.activityId } })
        })
      } else {
        this.codeCover = true
      }
    },
    closeCover () {
      this.codeCover = false
    },
    toDetailPage (item) {
      // eslint-disable-next-line camelcase
      let { skuId, filmName: film_name, filmId } = item
      this.$sensors.track("activity_page_img_click", {
        activity_id: "20210806",
        activity_name: this.activity_name,
        sku_id: skuId,
        film_name
      }, () => {
        this.$router.push({ name: "detail", query: { filmId, buy: 0, needHdc: "activity", skuId, skip: this.type } })
      })
    },
    ruleCoverClickHandle () {
      this.$sensors.track("activity_rule_click", {
        activity_id: "20210806",
        activity_name: this.activity_name
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
            activity_id: "20210806",
            activity_name: this.activity_name,
            sku_id: skuId,
            film_name: filmName
          })
          this.$router.push({ name: "detail", query: { filmId, buy: 0, needHdc: "activity", skuId, skip: this.type } })
        }
      }
    },
    listFetch () {
      return this.$services.operation.getActivityFilms({ type: this.type, activityId: this.activityId }).then(res => {
        this.dataList = res
        return res
      }).catch(err => {
        this.$toast.showToast(err.msg)
      })
    },
    toMoviePlayPage (ticketNo, filmId) {
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      env.browser.inApp ? this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL }) : this.$router.push({ name: "play", query: { filmId, ticketNo, type: this.type } })
    },
    setShare (code = "", activityId = "", shareInfo = {}) {
      const { shareTitle: title, shareDescription: desc, shareImage: img } = shareInfo
      let link = `${location.origin + location.pathname}?ucode=${code}${location.hash}${location.hash.indexOf("?") > 0 ? "&" : "?"}${!this.$route.query.activityId ? "activityId=" + activityId : ""}&source=user`
      this.SHARE_CONFIG({
        title,
        desc,
        link,
        img, // 分享图标
        jsApiList: ["chooseWXPay"]
      })
      this.shareData = {
        shareType: 0,
        shareTitle: title,
        shareContent: desc,
        shareThumImgUrl: img,
        shareResourceUrl: link
      }
    },
    async setUserInfo (uid) {
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
        activity_id: "20210806",
        activity_name: this.activity_name
      })
      let [err] = await utils.to(this.$services.operation.cancelTickets({ activityId: this.activityId, skuId: this.currentFilm.skuId }))
      if (!err) {
        let { spuId, skuId } = this.currentFilm
        this.confirmShow = false
        this.currentFilm ? this.$router.push({ name: "pay", query: { spuId, needHdc: "activity", skip: this.type, skuId } }) : this.$router.push({ name: "pay", query: { skip: "package", type: this.type } })
        if (!this.currentFilm) {
          this.$sensors.track("activity_page_lottery_click", {
            activity_id: "20210806",
            activity_name: this.activity_name
          })
        }
        this.currentFilm = ""
      }
    },
    appShareIconClick () {
      this.$sensors.track("activity_page_share_click", {
        activity_id: "20210806",
        activity_name: this.activity_name
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
        this.$router.push({ name: "pay", query: { skip: "package", type: this.type } })
        this.$sensors.track("activity_page_lottery_click", {
          activity_id: "20210806",
          activity_name: this.activity_name
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
        console.log(err)
        // this.$toast.showToast(err.msg)
      })
    },
    getTicketStatus (activityId, type) {
      return this.$services.operation.getTicketState({ activityId, type }).then(res => {
        this.ticketStatus = res
      }).catch((err) => {
        this.$toast.showToast(err.msg)
      })
    },
    getAuthStatus () {
      return this.$services.user.getAuthStatus().then(res => {
        this.authStatus = res
        return res
      }).catch(err => {
        this.$toast.showToast(err.msg)
      })
    },
    getChangeCodes (activityId) {
      return this.$services.operation.getChangeCodeList({ activityId }).then(res => {
        this.codes = res
      }).catch(err => {
        this.$toast.showToast(err.msg)
      })
    }
  },
  computed: {
    ...mapState([
      "login", "accountInfo", "userCode"
    ]),
    buttonText () {
      return this.basicData.id && !this.basicData.showStatus ? "活动已结束" : this.ticketStatus.enableBuyCollection || !this.login ? "3元看全场" : this.inApp ? "看电影 赢新能源汽车" : "转到App内观影可抽奖"
    }
  },
  async created () {
    window.scrollTo(0, 1)
    this.activityId = this.$route.query.activityId || ""
    this.openType = this.$route.query.openType || this.openType
    this.getTicketStatus(this.activityId, this.type)
    this.getActivityBaseInfo(this.type, this.activityId).then(() => {
      if (!this.basicData.showStatus) {
        this.loading = false
        return
      }
      if (env.browser.inApp) {
        this.$windvane.call("SCHYDataInterface.getUserInfo").then(({ data, success }) => {
          if (success && data.u_token) {
            this.$sensors.login(data.u_id)
            this.RECORD_USERINFO(data)
            axios.setUserToken(data.u_token)
            this.setUserInfo(data.u_id)
            Promise.all([this.listFetch(), this.getAuthStatus()]).then(res => {
            // eslint-disable-next-line no-unused-vars
              let [list, status] = res
              status && this.getChangeCodes(this.activityId)
              this.loading = false
            })
          } else {
            this.$windvane.call("SCHYUIInterface.showLoginPage")
          }
        }).catch(() => {
          this.$toast.showToast("登录后参与活动")
        })
      } else {
        if (localStorage.getItem("token")) {
          Promise.all([this.listFetch(), this.getAuthStatus()]).then(res => {
            // eslint-disable-next-line no-unused-vars
            let [list, status] = res
            status && this.getChangeCodes(this.activityId)
            this.loading = false
          })
        } else {
          this.$router.push({ name: "login", query: { redirect: location.hash.slice(1) } })
        }
      }
      this.$sensors.track("activity_page_enter", {
        activity_id: "20210806",
        activity_name: this.activity_name,
        source_user_code: utils.getQueryString("ucode") || "",
        page_source: this.sourceList[this.$route.query.source] || ""
      })
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
.summer-result{
  img{
    width: 100%;
  }
}
.summer {
  background-color:#000;

  min-height: 100vh;
  padding-top: rem(0.1);
  &.ruleShow{
    width: 100%;
    position: fixed;
  }
  .banner-share{
    width: rem(185);
    height: rem(38);
    position: absolute;
    top: rem(171);
    left: 0;
    right: 0;
    margin: auto;
    background: url(https://g.smartcinema.com.cn/images/e4278674779a4641a6ac2fe2d292befc-370-76.png) 0 0 no-repeat;
    background-size: cover;
}
  .content-container{
    width: 100%;
    padding-top: rem(0.1);
    padding-bottom: rem(120);
    background: url(https://g.smartcinema.com.cn/images/ea10e780b17342fca486dffb7b2a816e-750-128.png) bottom center no-repeat,url(https://g.smartcinema.com.cn/images/69525235a7604e4d8746397395d26710-750-2492.png) 0 0 no-repeat;
    background-size: 100%, cover;
    .identify-container{
      width: rem(347);
      padding: 0 rem(15) 0 rem(11);
      height: rem(80);
      background: linear-gradient(180deg, #FFFFFF 0%, #FFFFF8 100%);
      border-radius: rem(6);
      margin: rem(3) auto 0;
      @include flex($jus: space-between);
      .lucky-box{
        width: rem(78);
        height: rem(46);
        background: url(https://g.smartcinema.com.cn/images/7bf2aa16c63947f38d23fdbd616f28c7-156-92.png) 0 0 no-repeat;
        background-size: 100%;
      }
      .lucky-btn{
        width: rem(56);
        height: rem(56);
        background: url(https://g.smartcinema.com.cn/images/4d645bbec7f84b0097b9ec856690adaf-112-112.png) 0 0 no-repeat;
        background-size: 100%;
      }
      .certified{
        background: url(https://g.smartcinema.com.cn/images/17209989f2c741f599ace8c30ac30f5d-112-112.png) 0 0 no-repeat;
        background-size: 100%;
      }
      p{
        font-size: rem(14);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #B4B4B4;
        line-height: rem(20);
      }
      .blod-text{
        font-size: rem(16);
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 900;
        color: #000000;
        line-height: rem(22);
        span{
          color: rgba(232, 63, 34, 1);
        }
      }
    }
  }
  .list {
    overflow: hidden;
    margin-left: rem(15);
    margin-top: rem(18);
    .item {
      position:relative;
      float: left;
      margin-right: rem(7);
      margin-bottom: rem(15);
      width: rem(168);
      overflow: hidden;
      background:#fff;
      border-radius: rem(6);
      border: rem(1) rgba(249, 230, 188, 1) solid;
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
          font-weight: 900;
          color: #121212;
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
          width:rem(136);
          height:rem(34);
          background-image: linear-gradient(to right, rgba(253, 243, 189, 1) , rgba(243, 206, 135, 1));
          border-radius:rem(20);
          font-size: rem(16);
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #594B34;
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
    bottom: rem(64);
    margin: auto;
    width:rem(345);
    height: rem(44);
    background: url(https://g.smartcinema.com.cn/images/d7d4c9b606c74ce6b15e8c45fc42f196-690-88.png) 0 0 no-repeat;
    background-size: 100% 100%;
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
  .code-container{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    .code-box{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: rem(296);
      height: rem(400);
      background: linear-gradient(135deg, #FFF3D8 0%, #F9E6BC 100%);
      border-radius: rem(12);
      @include flex($flow: column);
      .code-box-close{
        width: rem(26);
        height: rem(26);
        background: url(https://g.smartcinema.com.cn/images/ec3c333ccdc0422e9e1e2695cd40ffe8-52-52.png) 0 0 no-repeat;
        background-size: cover;
        position: absolute;
        right: rem(-20);
        top: rem(-38);
      }
      .code-box-title{
        width: 100%;
        text-align: center;
        font-size: rem(18);
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #926411;
        line-height: rem(25);
        padding: rem(12) 0 rem(10);
        border-bottom: rem(1) solid rgba(248, 229, 188, 1);
      }
      .code-list-box{
        flex:1;
        // height: rem(353);
        overflow: hidden;
        .code-list{
          height: 100%;
          overflow: scroll;
          width: rem(246);
          margin: rem(3) auto 0;
          .code-item{
            @include flex($jus: space-between);
            border-bottom: rem(1) solid #F8E5BC;
            padding: rem(14) 0 rem(10);
            .code-detail{
              @include flex();
              img{
                display: block;
                width: rem(42);
                height: rem(42);
                margin-right: rem(12);
              }
              .code-info{
                .code-source{
                  font-size: rem(15);
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #926411;
                  line-height: rem(21);
                }
                .code-time{
                  font-size: rem(12);
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #926411;
                  line-height: rem(17);
                  white-space: nowrap;
                }
              }
            }
            .code{
              font-size: rem(14);
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #C72323;
              line-height: rem(20);
            }
          }
          .code-more{
            text-align: center;
            font-size: rem(13);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #926411;
            line-height: rem(18);
            margin: rem(35) 0;
            opacity: 0.3;
          }
        }
      }
      .share-btn{
        margin: rem(24) auto;
        button{
          width: rem(165);
          height: rem(36);
          border-radius: rem(20);
          background: linear-gradient(to right, rgba(215, 49, 49, 1),rgba(199, 35, 35, 1));
          font-size: rem(15);
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: rem(36);
        }
      }
    }
  }
}
</style>
