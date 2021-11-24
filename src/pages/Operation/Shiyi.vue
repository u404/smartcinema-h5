<template>
  <h5-fail-panel v-if="error"></h5-fail-panel>
  <h5-loading-panel v-else-if="loading"></h5-loading-panel>
  <div v-else :class="{'shiyi':true,'ruleShow':ruleCover}">
    <div class="rule-btn" @click="ruleCoverClickHandle">活动规则</div>
    <ActivityBanner :bannerImage="basicData.bannerImage" />
    <div class="content-container">
      <div class="list-container">
        <div class="title-bg"></div>
        <div class="prize-bg"></div>
        <p class="time">每天10点抽取前一天中奖者</p>
        <div class="list-card" v-for="(item, key) in dataList" :key="key">
          <div class="card-title">{{`10月0${key}日中奖名单`}}</div>
          <div class="card-labels">
            <span class="label"><b>用户名</b></span>
            <span class="label"><b>手机号</b></span>
          </div>
          <div class="card-content" v-for="subItem in item" :key="subItem.name">
            <span class="name">{{subItem.name}}</span>
            <span class="mobile">{{subItem.mobile}}</span>
          </div>
        </div>
        <p class="tips">本活动最终解释权归移动电影院所有</p>
      </div>
      <div v-if="!inApp" class="qrcode">
        <img src="https://g.smartcinema.com.cn/images/1c3b840e3723447d9c97a23d9430eb99-172-168.png" />
        <p>扫码下载</p>
        <p>移动电影院APP</p>
      </div>
    </div>
    <div class="footer">
      <div class="button-box">
        <button @click="toMoviePlayPage">看电影</button>
        <p>抽积分红包</p>
      </div>
      <div  class="button-box">
        <button @click="shareHandle" class="share-button"><img src="https://g.smartcinema.com.cn/images/a7eaa81549ec4591ba4c10a7f9019ba4-36-38.png" />分享朋友圈</button>
        <p>自动参与门票抽奖</p>
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
                <p>2021年10月01日-10月07日</p>
                <p class="subtitle">【活动1：天天送环球影城门票】</p>
                <p>奖品设置：北京环球影城门票*14张</p>
                <p>活动规则：</p>
                <p>1.打开移动电影院APP，分享指定活动页到微信朋友圈，即可自动参与门票抽奖；</p>
                <p>2.指定活动页面包括本活动页面、售票厅影片详情页、积分抽奖页；</p>
                <p>3.分享不限次数，用户可每天参与分享；</p>
                <p>4.第2天上午10点，抽取前1天的门票中奖者，每天抽取2位，每位获得1张门票；</p>
                <p>5.抽出中奖者后，移动电影院工作人员将核实用户是否分享朋友圈，如发现用户未分享朋友圈，将重新抽取中奖者（建议将朋友圈设置为所有人可见）；</p>
                <p>6.移动电影院工作人员将在3个工作日内联系中奖者，并为中奖者报销2021年内任意1张北京环球影城单人门票费用（门票时间不得超过2021年12月31日）；</p>
                <p>7.奖品仅限北京环球影城门票费用，不包含其他任何费用，如交通、优速通等。</p>
                <p class="subtitle">【活动2：特惠观影抽积分】</p>
                <p>活动规则：</p>
                <p>1.活动期间在App首页售票厅点开影片，可3元购买全站电影，或0.99元看单部电影（不包括专区及品牌场影片）；</p>
                <p>2.在App活动页内观影达3分钟，点击观影页面的抽奖按钮，即可参与抽奖（仅限App内可参与抽奖）；</p>
                <p>3.当天所购影片，每张票当天可进行1次观影抽奖，不限购票次数；</p>
                <p>4.当天所购影片，超过24点、核销或影片看完后，无抽奖机会；</p>
                <p>5.用户所购买的影片，可在10月1日-10月7日任意时间观影，但每张影票仅限观看1遍影片，且结束后不可继续观看。</p>
                <p class="subtitle">【积分提现】</p>
                <p>每位用户每天仅限提现1次：</p>
                <p>1.提现说明：下载移动电影院App-登录账号-【我的】-【我的积分】-【积分提现】-【绑定支付账户】-【提现至微信红包】；</p>
                <p>2.用户积分≥100即可提现，积分按100的整数倍提取，如333积分提现3元整，账户剩余33积分；</p>
                <p>3.提交申请后1-5个工作日内即可到账；</p>
                <p>4.用户申请积分提现后，会以微信转账方式发放到用户绑定的微信零钱账户中。</p>
                <p class="subtitle">【活动规则&注意】</p>
                <p>1.仅限活动期间，按规则参与活动的用户获得奖励；</p>
                <p>2.奖品仅限北京环球影城门票费用，不包含其他任何费用（如交通、优速通等）；</p>
                <p>3.抽出北京环球影城门票中奖者后，移动电影院工作人员将核实用户是否有分享朋友圈，如发现用户未分享朋友圈，将重新抽取中奖者（建议将朋友圈设置为所有人可见）；</p>
                <p>4.移动电影院工作人员将在3个工作日内联系中奖者，并为中奖者报销2021年任意1张北京环球影城单人门票，门票时间不得超过2021年12月31日；</p>
                <p>5.如移动电影院根据中奖者手机号信息无法联系到中奖者本人，超过1个月，移动电影院将有权收回奖品；</p>
                <p>6.仅限首页售票厅影片观影3分钟的用户获得积分抽奖机会，专区及包场影片不参与本活动；</p>
                <p>7.观影未达3分钟，无积分抽奖机会；</p>
                <p>8.用户必须绑定微信支付才可以提现，同一个微信、同一用户只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
                <p>9.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
                <p>10.基于保护用户权益的考虑，移动电影院会对您的帐号进行风险检测，对于虚拟帐号等高风险用户，移动电影院有权对您的帐号进行冻结处理。如有问题，请联系移动电影院客服。</p>
                <p>11.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
                <p>12.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
                <p>13.依据相关法律法规要求，平台向您支付积分提现奖励时需履行代扣代缴义务；您参与此次活动就表示同意并知晓纳税义务，如相关报酬需依法申报缴纳相关税款，平台将根据国家税务法规要求向税务机关提供必要的税务申报信息（包括您的身份信息、报酬金额等税务机关要求的信息），并由平台依法为您完成相关的纳税申报。</p>
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
import ActivityBanner from "@/components/ActivityBanner"
import utils from "@/common/scripts/utils"
import axios from "@sc/lib-axios"
import env from "@sc/lib-env"
export default {
  components: {
    ActivityBanner
  },
  data () {
    return {
      ruleCover: false,
      inApp: env.browser.inApp,
      dataList: [],
      loading: true,
      type: "shiyi2021",
      activity_name: "2021国庆七天乐活动",
      shareData: {},
      sourceList: {
        "banner": "首页banner",
        "pop": "首页霸屏",
        "user": "用户分享"
      }
    }
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "SHARE_CONFIG", "RECORD_USERCODE"
    ]),
    shareHandle () {
      env.browser.inApp ? this.$windvane.call("SCHYUIInterface.openShareWindow", { shareData: this.shareData }) : this.$shareCover().show()
    },
    ruleCoverClickHandle () {
      this.$sensors.track("activity_rule_click", {
        activity_id: "20211001",
        activity_name: this.activity_name
      }, () => {
        this.ruleCover = true
      })
    },
    listFetch () {
      return this.$services.operation.getPrizeList({ type: this.type, activityId: this.activityId }).then(res => {
        this.dataList = res
        return res
      }).catch(err => {
        this.$toast.showToast(err.msg)
      })
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
    async getUserInfo (uid) {
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
      this.$sensors.track("activity_page_share", {
        activity_id: "20211001",
        activity_name: "2021国庆七天乐活动",
        page_name: "中奖页"
      })
    },
    getActivityBaseInfo (type, activityId) {
      return this.$services.operation.getActivityBasic({ type, activityId }).then(res => {
        this.basicData = res
        this.activityId = res.id
        this.setShare(this.userCode, res.id, res)
      }).catch((err) => {
        this.setShare()
        console.log(err)
      })
    },
    toMoviePlayPage () {
      if (this.inApp) {
        this.$windvane.call("WVBaseUI.closeWebView")
      } else {
        if (this.login) {
          this.$confirm.showConfirm({
            msg: "下载移动电影院APP",
            confirmClick: () => {
              this.confirmShow = false
              this.$callapp.gotoPage()
            },
            cancelClick: () => {
              this.$confirm.close()
            }
          })
        } else {
          this.$router.push({ name: "login", query: { redirect: location.hash.slice(1) } })
        }
      }
    }
  },
  computed: {
    ...mapState([
      "login", "userCode"
    ])
  },
  async created () {
    window.scrollTo(0, 1)
    this.activityId = this.$route.query.activityId || ""
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
            this.getUserInfo(data.u_id)
          }
        }).catch(() => {
        }).finally(() => {
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
        activity_id: "20211001",
        activity_name: this.activity_name,
        enter_type: this.inApp ? "站内" : "站外"
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
.shiyi {
  background-color:#000;
  min-height: 100vh;
  padding-top: rem(0.1);
  &.ruleShow{
    width: 100%;
    position: fixed;
  }
  .content-container{
    // background-color: ;
    padding: rem(0.1) 0 rem(90);
    .list-container{
      position: relative;
      width: rem(351);
      margin: rem(-18) auto 0;
      background: #FFFFFF;
      border-radius: rem(8);
      border: rem(2) solid rgba(246, 188, 10, 0.31);
      .title-bg{
        width: rem(169);
        height: rem(36);
        background: url(https://g.smartcinema.com.cn/images/304159b2284d48b3a1f97d55dc7e8c38-338-72.png) 0 0 no-repeat;
        background-size: cover;
        margin: rem(-18) auto 0;
      }
      .prize-bg{
        width: rem(267);
        height: rem(20);
        background: url(https://g.smartcinema.com.cn/images/5d1e8f6a8ed64f3c815cd4d4ec7309ef-534-40.png) 0 0 no-repeat;
        background-size: cover;
        margin: rem(20) auto 0;
      }
      .time{
        text-align: center;
        font-size: rem(12);
        margin: rem(8) 0 rem(16);
        color: #685D40;
        line-height: rem(17);
      }
      .tips{
        text-align: center;
        margin: rem(25) 0 rem(20);
        font-size: rem(13);
        color: #7C7C7C;
        line-height: rem(18);
      }
      .list-card{
        text-align: center;
        width: rem(324);
        border-radius: rem(8);
        margin: 0 auto rem(22);
        padding: rem(16) rem(18) rem(9);
        background: linear-gradient(151deg, #FDF2BC 0%, #FFEAB4 52%, #FDF2BC 100%);
        .card-title{
          font-size: rem(15);
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #EB590E;
          line-height: rem(21);
        }
        .card-labels{
          @include flex();
          padding: rem(13) rem(50) rem(18) rem(41);
          .label{
            position: relative;
            font-size: rem(15);
            font-weight: 500;
            color: #121212;
            line-height: rem(21);
            b{
              position: relative;
              z-index: 2;
            }
            &::before{
              content: "";
              display: block;
              width: 100%;
              box-sizing: content-box;
              height: rem(8);
              padding: 0 rem(3);
              background: #FFBE17;
              border-radius: rem(4);
              opacity: 0.56;
              position: absolute;
              bottom: 0;
              left: rem(-3)
            }
          }
        }
        .card-content{
          @include flex();
          width: rem(288);
          height: rem(30);
          background: #FFFFFF;
          border-radius: rem(15);
          margin:0 auto rem(10);
          padding: 0 rem(23) 0 rem(33);
          span{
            font-size: rem(14);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: rem(20);
          }
          .name,.mobile{
            display: inline-block;
            width: rem(100);
            text-align: center;
          }
          .name{
            width: rem(60);
          }
        }
      }
    }
    background:url(https://g.smartcinema.com.cn/images/19ca1abd371f44369accb08ce9740c75-750-3586.png) bottom center no-repeat, #3372E1;
    background-size: cover;
  }
  .qrcode{
    text-align: center;
    img{
      width: rem(86);
      height: rem(86);
      margin: rem(37) auto rem(12);
    }
    p{
      font-size: rem(11);
      font-weight: 400;
      color: #FFFFFF;
      line-height: rem(15);
    }
  }
  .footer{
    @include flex($jus: space-between);
    width: 100%;
    height: rem(106);
    padding: 0 rem(30);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 5;
    background: linear-gradient(180deg, rgba(15, 15, 15, 0) 0%, rgba(15, 15, 15, 0.9) 100%);
    .button-box{
      text-align: center;
      button{
        font-size: rem(15);
        font-weight: 500;
        color: #594B34;
        width: rem(150);
        height: rem(32);
        line-height: rem(32);
        background: linear-gradient(135deg, #FEF3BD 0%, #F3CF8A 100%);
        border-radius: rem(19);
      }
      .share-button{
        @include flex($jus: center);
        background: linear-gradient(135deg, #E73E2A 0%, #D83422 100%);
        color: #FFFFFF;
        img{
          width: rem(18);
          height: rem(18);
          margin-right: rem(4);
        }
      }
      p{
        font-size: rem(11);
        color: #FFFFFF;
        line-height: rem(16);
        margin-top: rem(8);
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
