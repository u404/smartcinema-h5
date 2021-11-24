<template>
  <section :class="{'activity':true,'ruleShow':ruleCover}">
    <header>
      <img v-lazyload="basicData.bannerImage" />
      <span class="rule-btn" @click="ruleCoverClickHandle">活动规则</span>
    </header>
    <section class="sliderPro">
      <h5>{{filmData.filmNameCn}}</h5>
    </section>
    <section class="video—container" >
      <video-player  class="video-player-box"
          ref="videoPlayer"
          :options="playerOptions"
          @ended="onPlayerEnded($event)"
          :playsinline="true">
        </video-player>
    </section>
    <section class="info">
      <article>
        {{filmData.filmHeadDesc}}
        <span>{{filmData.filmReleaseTime}}</span>
      </article>
      <span></span>
    </section>
    <section class="filmInfo">
      <article class="filmDesc">
        <ellipsis-text ref="eltext" line="5" :content="filmData.introduction"></ellipsis-text>
        <article  v-if="filmData.doubanScore">
          <span class="score-title">参考评分：{{filmData.doubanScore}}</span><star-rate :allow-clear="false" active-color="#FFC000" font-size="0.4rem" :value="filmData.doubanScore/2" disabled  :star-half="true" />
        </article>
      </article>
    </section>
    <section class="actor-container">
      <sub-title title="主创人员" />
      <actor-slide :actorData="filmData.performers" />
    </section>
    <section class="tag-container" v-if="commentTags.length">
      <sub-title title="评价分类" />
      <div class="tag-box">
        <span v-for="(item,index) in commentTags" :key="index">{{item.tag}} {{item.num>0? item.num : ""}}</span>
      </div>
    </section>
    <section class="tab-container">
      <div class="tabs">
        <span @click="changeCommentStatus(2)" :class="{'tab-title-active': status === 2}">热门影评</span>
        <span @click="changeCommentStatus(1)" :class="{'tab-title-active': status === 1}">最新影评</span>
      </div>
      <div class="icons" v-if="filmData.ticketNo && filmData.skuStatus !== 2 && inApp">
        <span class="reward" @click.stop="praiseIconHandle('reward')"></span>
        <span class="refund" @click.stop="praiseIconHandle('refund')"  v-if="filmData.refundStatus === -1 && inApp && !filmData.zeroPaySet"></span>
      </div>
    </section>
    <loadmore
      :bottomMethod="loadBottom"
      :bottomAllLoaded="bottomAllLoaded"
      @bottomStatusChanged="statusChangeHandle"
      bottomPullText="上拉加载更多"
      ref="loadmore"
      v-show="commentList.length"
    >
      <ul class="loadmore-list">
        <li v-for="item in commentList" class="loadmore-item" :key="item">
          <CommentItem :comment="item" @like="likeHandle"  v-if="item.content">
            <template>
              <star-rate v-if="item.score"  :allow-clear="false" active-color="#FFC000" font-size="0.3rem" :value="item.score" disabled />
            </template>
          </CommentItem>
        </li>
      </ul>
    </loadmore>
    <div v-if="filmData.filmId && filmData.ticketNo && this.filmData.skuStatus === 2 && (!ios || (ios && !vable))" class="time-container margin-none" style="justify-content: center;"><div>距检票：<span>{{hourNum}}</span>时<span>{{minuteNum}}</span>分<span>{{secondNum}}</span>秒</div></div>
    <div v-if="filmData.filmId && filmData.ticketNo && this.filmData.skuStatus === 2 && ((ios && vable) || !inApp)" class="time-container border-none">
      <div>距检票：<span>{{hourNum}}</span>时<span>{{minuteNum}}</span>分<span>{{secondNum}}</span>秒</div>
      <div :class="{'date-btn': true, 'subscribed': !!subscribeData.status}" @click="setSubscribe">{{subscribeData.status ? "已订阅" : "订阅日历"}}</div>
    </div>
    <v-button :class="{disable: !filmData.ticketNo && remainingTicketNum <= 0}" v-if="filmData.filmId && (!filmData.ticketNo || this.filmData.skuStatus !== 2)" :title="filmData.ticketNo ?`马上观影`:'加入金牌评审团'" @click="filmHandle"></v-button>
    <div class="disable" v-if="basicData.id && !basicData.showStatus"><v-button title="活动已结束"></v-button></div>
    <!-- 规则 -->
    <section class="rule-container" @click.self="ruleCover = false" v-if="ruleCover">
      <article class="rule-wrapper">
        <section class="rule">
          <h2>
            <span class="title">活动规则</span>
          </h2>
          <article class="context-container">
            <section class="context-wrapper" v-if="filmData.zeroPaySet">
              <p class="subtitle">【放映时间】</p>
              <p>本周五下午16:00-周六22:00</p>
              <p class="subtitle">【预约时间】</p>
              <p>即日起至本周六22:00</p>
              <p class="subtitle">【活动玩法】</p>
              <p>用户点击“加入金牌评审团”，即可预约“5”夜点映活动，观看本周推荐的1部院线新片，并参与点评。</p>
              <p>1.每位用户每周最多领取1张入场券，且仅限观看1次；</p>
              <p>2.用户观影时可随时为影片“点赞”，作为评价影片品质的“感动值”，次数不限；</p>
              <p>3.用户观影时可自愿“为感动付费”，即付费支持影片，付费金额任意；</p>
              <p>4.每位金牌评审官可以对影片进行1次点评，首次点评超过15字可获得10积分奖励（多次点评无奖励，水帖无积分奖励）；</p>
              <p>5.每周仅限前5000位购票用户参与点映活动；</p>
              <p>6.限本周五下午16:00-周六22:00期间观看，过期入场券作废，影片下映。</p>
              <p class="subtitle">【积分提现】</p>
              <p>每位用户每天仅限提现1次：</p>
              <p>1.提现说明：在移动电影院App点击【我的】-【我的积分】-【积分提现】-【绑定支付账户】-【提现至微信红包】；</p>
              <p>2.100≤用户积分即可提现，积分按100的整数倍提取，如333积分提现3元整，账户剩余33积分。积分不足可前往【我的积分】页做任务获得积分；</p>
              <p>3.提交申请后1-3个工作日内即可到账；</p>
              <p>4.用户申请积分提现后，会以微信转账方式发放到用户绑定的微信零钱账户中。</p>
              <p class="subtitle">【活动规则&注意】</p>
              <p>1.仅限活动期间按规则预约的用户参与；</p>
              <p>2.仅限本活动页内指定的影片参与活动，活动页之外的影片不参与活动；</p>
              <p>3.用户必须绑定微信支付才可以提现，且同一个微信只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
              <p>4.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
              <p>5.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
              <p>6.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
              <p>7.依据相关法律法规要求，平台向您支付积分提现奖励时需履行代扣代缴义务；您参与此次活动就表示同意并知晓纳税义务，如相关报酬需依法申报缴纳相关税款，平台将根据国家税务法规要求向税务机关提供必要的税务申报信息（包括您的身份信息、报酬金额等税务机关要求的信息），并由平台依法为您完成相关的纳税申报。</p>
              <p>*本活动最终解释权归移动电影院所有</p>
            </section>
            <section class="context-wrapper" v-else>
              <p class="subtitle">【放映时间】</p>
              <p>本周五下午16:00-周六22:00</p>
              <p class="subtitle">【预约时间】</p>
              <p>即日起至本周六22:00</p>
              <p class="subtitle">【活动玩法】</p>
              <p>点击“加入金牌评审团”，支付期待金，即可预约“5”夜点映活动，观看本周推荐的1部院线新片，并参与点评。</p>
              <p>1.期待金可退：观影期间如认为影片不值票价，可“自定退费金额“，最高退费金额不超过已支付的期待金额度；（仅限1次，不可重复退费，提交申请后退费金额将在24小时内返回原账户）</p>
              <p>2.用户观影时可随时为影片“点赞”，作为评价影片品质的“感动值”，次数不限；</p>
              <p>3.用户观影时可自愿“为感动付费”，即付费支持影片，付费金额任意；</p>
              <p>4.每位金牌评审官可以对影片进行1次点评，首次点评超过15字可获得10积分奖励（多次点评无奖励，水帖无积分奖励）；</p>
              <p>5.每周仅限前5000位购票用户参与点映活动；</p>
              <p>6.限本周五下午16:00-周六22:00期间观看，过期影票作废，影片下映。</p>
              <p class="subtitle">【积分提现】</p>
              <p>每位用户每天仅限提现1次：</p>
              <p>1.提现说明：在移动电影院App点击【我的】-【我的积分】-【积分提现】-【绑定支付账户】-【提现至微信红包】；</p>
              <p>2.100≤用户积分即可提现，积分按100的整数倍提取，如333积分提现3元整，账户剩余33积分。积分不足可前往【我的积分】页做任务获得积分；</p>
              <p>3.提交申请后1-3个工作日内即可到账；</p>
              <p>4.用户申请积分提现后，会以微信转账方式发放到用户绑定的微信零钱账户中。</p>
              <p class="subtitle">【活动规则&注意】</p>
              <p>1.仅限活动期间按规则预约的用户参与；</p>
              <p>2.电影放映前，电影票可退；已经观看或超过电影放映时间，电影票不可退；</p>
              <p>3.仅限本活动页内指定的影片参与活动，活动页之外的影片不参与活动；</p>
              <p>4.用户必须绑定微信支付才可以提现，且同一个微信只能绑定一个账号。若因用户未绑定支付账号，或用户微信账户未进行实名认证等用户自身账户原因致使转账失败，由用户自行承担；</p>
              <p>5.如用户以任何不正当手段或舞弊方式参与本活动，一经发现，移动电影院有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，移动电影院有权采取不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额，追讨已发放的金额，并保留追究该用户责任的权利；</p>
              <p>6.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊），移动电影院将取消用户的活动资格、并有权撤销相关违规交易、收回奖励（包括已发放奖励）等利益，同时依照相关规则进行处理；</p>
              <p>7.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部分指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则移动电影院可决定暂停或终止本活动，并可依相关法律法规的规定主张免责；</p>
              <p>8.依据相关法律法规要求，平台向您支付积分提现奖励时需履行代扣代缴义务；您参与此次活动就表示同意并知晓纳税义务，如相关报酬需依法申报缴纳相关税款，平台将根据国家税务法规要求向税务机关提供必要的税务申报信息（包括您的身份信息、报酬金额等税务机关要求的信息），并由平台依法为您完成相关的纳税申报。</p>
              <p>*本活动最终解释权归移动电影院所有</p>
            </section>
          </article>
        </section>
        <p class="close" @click="ruleCover = false"></p>
      </article>
    </section>
    <loginContainer :userInfo="userInfo" :islogin="login" :visible="loginVisible" @success="getFreeTicket" @close="loginCloseHandle" />
    <div class="comment-btn" @click.stop="praiseIconHandle('comment')"  v-if="filmData.ticketNo && inApp"></div>
  </section>
</template>

<script>
import { videoPlayer } from "vue-video-player"
import "video.js/dist/video-js.css"
import "videojs-contrib-hls"
import { mapState, mapMutations } from "vuex"
import ActorSlide from "@/components/ActorSlide"
import SubTitle from "@/components/SubTitle"
import EllipsisText from "@/components/EllipsisText"
import LoginContainer from "@/components/LoginContainer"
import CommentItem from "@/components/CommentItem"
import StarRate from "vue-cute-rate"
import Loadmore from "@/components/Loadmore"
import VButton from "@/components/VButton"
import utils from "@/common/scripts/utils"
import axios from "@sc/lib-axios"
import env from "@sc/lib-env"
export default {
  components: {
    ActorSlide,
    EllipsisText,
    SubTitle,
    VButton,
    CommentItem,
    Loadmore,
    StarRate,
    LoginContainer,
    videoPlayer
  },
  data () {
    return {
      filmData: {},
      ruleCover: false,
      inApp: env.browser.inApp,
      list: [],
      bottomStatus: "",
      bottomAllLoaded: false,
      loadText: "上拉加载更多",
      page: 1,
      size: 10,
      commentTargetId: "",
      type: 9,
      status: 2,
      commentList: [],
      liking: false,
      openType: "drawer",
      basicData: {},
      timer: "",
      hours: "",
      minutes: "",
      seconds: "",
      activityId: "",
      commentTags: [],
      loginVisible: false,
      subscribeData: {},
      page_source: "",
      ios: env.os.ios,
      vable: false,
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
      }
    }
  },
  methods: {
    ...mapMutations(["RECORD_USERINFO", "RECORD_POINTS", "SHARE_CONFIG"]),
    praiseIconHandle (type) {
      // eslint-disable-next-line camelcase
      let { skuId: sku_id, filmNameCn: film_name } = this.filmData
      this.$sensors.track(`activity_page_${type}`, {
        sku_id,
        film_name
      }, () => {
        this.$router.push({ name: "praise", query: { type, from: "week" } })
      })
    },
    loginCloseHandle () {
      this.loginVisible = false
      this.listFetch()
    },
    async likeHandle (item) {
      if (this.liking) {
        return
      }
      if (!this.login) {
        env.browser.inApp ? this.appLogin() : this.$router.push({ name: "login" })
        return
      }
      this.liking = true
      let sendData = {
        likeTargetId: item.commentId,
        likeTargetType: 0
      }
      let like = item.like
      item.like = !item.like
      item.totalNum = like ? (item.totalNum - 1) : (item.totalNum + 1)
      // eslint-disable-next-line no-unused-vars
      let [err, data] = like ? await utils.to(this.$services.comment.setUnlike(sendData)) : await utils.to(this.$services.comment.setLike(sendData))
      this.liking = false
    },
    loadBottom () {
      this.page += 1
      this.commentFetch()
    },
    async getFreeTicket () {
      let loading = this.$toast.showLoading()
      // eslint-disable-next-line no-unused-vars
      let [err, data] = await utils.to(this.$services.operation.getFridayFreeTicket({ activityId: this.activityId }))
      this.$toast.close(loading)
      this.loginVisible = false
      if (err) {
        if (err.msg === "用户已经有票") {
          env.browser.inApp ? this.$router.push({ name: "tickets" }) : this.$toast.showToast("恭喜您成为金牌评审官")
          this.listFetch()
        } else {
          this.$toast.showToast(err.msg)
        }
      } else {
        env.browser.inApp ? this.$router.push({ name: "tickets" }) : this.$toast.showToast("恭喜您成为金牌评审官")
        this.listFetch()
      }
    },
    statusChangeHandle (status) {
      if (this.bottomStatus === status && status === "loading") {
        this.bottomStatus = "pull"
      } else {
        this.bottomStatus = status
      }
    },
    changeCommentStatus (val) {
      if (this.status !== val) {
        this.status = val
        this.page = 1
        this.commentList = []
        this.bottomAllLoaded = false
        this.loadText = "上拉加载更多"
        this.commentFetch()
      }
    },
    ruleCoverClickHandle () {
      this.ruleCover = true
      this.$sensors.track("activity_rule_click", {
        activity_id: "20201030",
        activity_name: "五夜点映活动"
      })
    },
    async filmHandle () {
      let { ticketNo, filmId, filmNameCn, skuStatus, skuId, spuId, remainingTicketNum, zeroPaySet } = this.filmData
      if (ticketNo) {
        this.$sensors.track("activity_page_film_view", {
          sku_id: skuId,
          activity_name: "五夜点映活动",
          film_name: filmNameCn,
          activity_date: this.activityDate,
          page_source: this.page_source
        }, () => {
          if (skuStatus === 2 && env.browser.inApp) {
            const schemeURL = `smartcinema://ticketList?index=0`
            this.$windvane.call("SCHYUIInterface.closedWebToNativeView", { schemeURL })
            return false
          }
          env.browser.inApp
            ? this.toMoviePlayPage(ticketNo, filmId)
            : this.$router.push({ name: "detail", query: { filmId: filmId, buy: 1 } })
        })
      } else {
        this.$sensors.track("activity_page_buy", {
          page_source: this.page_source,
          activity_date: this.activityDate,
          activity_name: "五夜点映活动",
          sku_id: skuId,
          film_name: filmNameCn
        })
        if (!this.login && env.browser.inApp) {
          let v = navigator.userAgent.match(/SmartCinema\/([0-9]+.[0-9]+.[0-9]+)/)[1]
          if (this.openType === "poplayer" && env.os.ios && !utils.versionCompare(v, "3.0.5")) {
            this.$toast.showToast("请登录后参与本活动")
            setTimeout(() => {
              this.$windvane.call("SCHYPoplayerInterface.closePoplayer")
            }, 2000)
          } else {
            this.appLogin(this.listFetch)
          }
        } else {
          if (this.accountInfo.status === 2) {
            this.$toast.showToast("您的账号存在异常，无法参加本次活动")
            return
          }
          if (remainingTicketNum <= 0) {
            this.$toast.showToast("暂无余票")
            return
          }
          zeroPaySet ? (env.browser.inApp ? (this.getFreeTicket()) : (this.loginVisible = true)) : this.$router.push({ name: "pay", query: { spuId, needHdc: "activity", skip: env.browser.inApp ? "ticket" : "week", skuId } })
        }
      }
    },
    setSubscribe () {
      // eslint-disable-next-line camelcase
      let { activityDate: activity_date, page_source, subscribeData: { status, calendar }, filmData: { skuId: sku_id, filmNameCn: film_name } } = this
      let webUrl = `${location.origin + location.pathname}?ucode=${this.userCode}${location.hash}${location.hash.indexOf("?") > 0 ? "&" : "?"}source=&t=1`
      // eslint-disable-next-line handle-callback-err
      let url = `${encodeURIComponent(webUrl)}`
      this.$sensors.track("activity_page_subscribe", {
        sku_id,
        activity_name: "五夜点映活动",
        film_name,
        activity_date,
        page_source
      })
      if (!this.login) {
        env.browser.inApp ? this.appLogin(this.listFetch) : this.$callapp.gotoPage({
          pathname: "web",
          params: {
            stringUrl: url
          }
        })
        return
      }
      if (!env.browser.inApp) {
        this.$callapp.gotoPage({
          pathname: "web",
          params: {
            stringUrl: url
          }
        })
        return
      }
      if (status || !calendar || !calendar.title) return
      let loading = this.$toast.showLoading()
      let { filmNameCn, skuId } = this.filmData
      url = calendar.url
      this.$windvane.call("HYBaseAbility.addCalendarEvent", calendar).then(async res => {
        this.$toast.close(loading)
        if (res.data.code === 0) {
          // eslint-disable-next-line no-unused-vars
          let [err, data] = await utils.to(this.$services.operation.reportSubscribeInfo({ filmName: filmNameCn, skuId, url }))
          if (!err) {
            this.$toast.showToast("订阅成功")
            this.getSubscribeHandle(this.filmData)
          }
        } else {
          this.$toast.showToast(res.data.code === 1 ? "授权失败" : "订阅失败")
        }
      })
    },
    appLogin (cb) {
      this.$windvane.call("SCHYUIInterface.showLoginPage", {
        refreshWhenLogin: "0"
      }).then(async ({ data, success }) => {
        if (success) {
          this.$sensors.login(data.u_id)
          this.RECORD_USERINFO(data)
          axios.setUserToken(data.u_token)
          cb && cb()
          this.getBaseInfo(data.u_id)
        } else {
          cb && cb()
        }
      }).catch(() => {})
    },
    async getBaseInfo (uid) {
      let codePromise = utils.to(this.$services.user.getuserCode({ "X-User-Id": uid }))
      let pointsPromise = utils.to(this.$services.user.getUserPoints({ "X-User-Id": uid }))
      // eslint-disable-next-line no-unused-vars
      let [codeErr, codeData] = await codePromise
      let [pointstErr, pointsData] = await pointsPromise
      if (!codeErr) {
        this.setShare(codeData.code, this.activityId, this.basicData)
      }
      !pointstErr && this.RECORD_POINTS(pointsData)
    },
    async listFetch () {
      const loading = this.$toast.showLoading()
      let [err, data] = await utils.to(
        this.$services.home.getFridayFilmDetail({ activityId: this.activityId })
      )
      this.$toast.close(loading)
      if (err) {
        this.$toast.showToast(err.msg)
        return
      }
      !this.filmData.skuId && this.$sensors.track("activity_page_enter", {
        page_source: this.page_source,
        activity_date: this.activityDate,
        activity_name: "五夜点映活动",
        sku_id: data.skuId,
        film_name: data.filmNameCn
      })
      if (data.ticketNo && data.skuStatus === 2 && data.curTime < data.releaseStartTime) {
        this.countTime(data.curTime)
      }
      this.filmData = data
      this.commentTargetId = data.filmId
      if (data.video.length && /^https?.+\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/i.test(data.video[0].videoUrl)) {
        this.player.poster(data.video[0].videoImg || data.filmHeadImg)
        this.player.src(data.positiveFragmentUrl || data.video[0].videoUrl)
      }
      this.getTags()
      this.commentFetch()
      this.login && data.skuStatus === 2 && this.getSubscribeHandle(data)
    },
    async getSubscribeHandle ({ filmNameCn, skuId }) {
      let webUrl = this.$route.query.activityId ? location.href : `${location.origin + location.pathname}?ucode=${this.userCode}${location.hash}${location.hash.indexOf("?") > 0 ? "&" : "?"}activityId=${this.activityId}&source=calendar&t=1`
      // eslint-disable-next-line handle-callback-err
      // let [err, data] = await utils.to(this.$services.operation.getShortUrl({ url: webUrl }))
      let url = `https://scdeeplink.smartcinema.com.cn/web?stringUrl=${encodeURIComponent(encodeURIComponent(webUrl))}`
      let [subscribeErr, subscribeData] = await utils.to(this.$services.operation.getSubscribeInfo({ filmName: filmNameCn, skuId, url }))
      if (subscribeErr) {
        this.$toast.showToast(subscribeErr.msg)
      } else {
        this.subscribeData = subscribeData
      }
    },
    async getTags () {
      // eslint-disable-next-line no-sequences
      let [tagErr, tagData] = await utils.to(this.$services.comment.getSummaryTags({ filmId: this.commentTargetId }))
      if (tagErr) {
        this.$toast.showToast(tagErr.msg)
        return
      }
      this.commentTags = tagData
    },
    toMoviePlayPage (ticketNo, filmId) {
      const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
      this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
    },
    async commentFetch () {
      let [err, data] = await utils.to(this.$services.comment.getCommentList({
        page: this.page,
        size: this.size,
        commentTargetId: this.commentTargetId,
        type: this.type,
        status: this.status
      }))
      if (data.isEnd) {
        this.bottomAllLoaded = true
        this.loadText = "已加载全部评论"
      }
      if (err) return
      this.commentList = this.commentList.length ? this.commentList.concat(data.list) : data.list
      this.$refs.loadmore.onBottomLoaded()
    },
    countTime (startTime) {
      // 差值
      var leftTime = parseInt((this.filmData.releaseStartTime * 1000) - (startTime * 1000))
      var h = parseInt(leftTime / (1000 * 60 * 60))
      var m = parseInt((leftTime % (1000 * 60 * 60)) / (1000 * 60))
      var s = parseInt((leftTime % (1000 * 60)) / 1000)
      this.hours = h
      this.minutes = m
      this.seconds = s
      if (leftTime <= 0) {
        window.clearTimeout(this.timer)
        location.reload()
      } else {
        this.timer = setTimeout(this.countTime.bind(this, startTime + 1), 1000)
      }
    },
    setShare (code = "", activityId = "", shareInfo = {}) {
      let url = this.$route.query.activityId ? location.href : `${location.origin + location.pathname}?ucode=${code}${location.hash}${location.hash.indexOf("?") > 0 ? "&" : "?"}activityId=${activityId}`
      this.SHARE_CONFIG({
        title: shareInfo.shareTitle || "金牌评审官席位限量报名，5000席位，抢先认证！",
        desc: shareInfo.shareDescription || "点映院线大片，付费随心，票房口碑你来定",
        link: url,
        img: shareInfo.shareImage || "https://g.smartcinema.com.cn/images/f98d3538aabc49f3b0c7ea9c7a723d8e-120-120.jpg", // 分享图标
        jsApiList: ["chooseWXPay"]
      })
    },
    onPlayerEnded (player) {}
  },
  computed: {
    ...mapState(["userInfo", "login", "accountInfo", "userCode"]),
    hourNum () {
      if (this.hours < 10) return "0" + this.hours
      return this.hours || "00"
    },
    minuteNum () {
      if (this.minutes < 10) return "0" + this.minutes
      return this.minutes || "00"
    },
    secondNum () {
      if (this.seconds < 10) return "0" + this.seconds
      return this.seconds || "00"
    },
    activityDate () {
      return `${new Date(this.basicData.startTime * 1000).format(("yyyy-MM-dd hh:mm:ss"))}~ ${new Date(this.basicData.endTime * 1000).format(("yyyy-MM-dd hh:mm:ss"))}`
    },
    player () {
      return this.$refs.videoPlayer && this.$refs.videoPlayer.player
    }
  },
  beforeCreate () {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  },
  async created () {
    this.activityId = this.$route.query.activityId || ""
    this.page_source = (this.$route.query.source === "calendar" && env.browser.inApp) ? "订阅日历" : env.browser.inApp ? "站内" : "站外分享"
    let [basicErr, basicData] = await utils.to(this.$services.operation.getActivityBasic({ type: "fridayFilm", activityId: this.activityId }))
    if (!basicErr) {
      this.basicData = basicData
      this.activityId = basicData.id
      this.setShare(this.userCode, basicData.id, basicData)
    } else {
      this.setShare()
      this.$toast.showToast(basicErr.msg)
      return
    }
    if (env.browser.inApp) {
      let v = navigator.userAgent.match(/SmartCinema\/([0-9]+.[0-9]+.[0-9]+)/)[1]
      if (utils.versionCompare(v, "3.0.8")) {
        this.vable = true
      }
      this.openType = this.$route.query.openType || this.openType
      this.$windvane
        .call("SCHYDataInterface.getUserInfo")
        .then(async ({ data, success }) => {
          if (success && data.u_token) {
            this.$sensors.login(data.u_id)
            axios.setUserToken(data.u_token)
            this.RECORD_USERINFO(data)
            this.listFetch()
            this.getBaseInfo(data.u_id)
          } else {
            this.listFetch()
          }
        })
        .catch(() => {
          this.listFetch()
        })
    } else {
      this.listFetch()
    }
  },
  destroyed () {
    window.clearTimeout(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.activity {
  height: 100vh;
  overflow-y: auto;
  background-color: rgba(17, 17, 17, 1);
  padding-bottom: rem(80);
  &.ruleShow {
    position: fixed;
  }
  /deep/ .loadmore-hint{
    text-align: center;
  }
  header {
    position: relative;
    width: rem(375);
    // height: rem(348);
    img{
      width: 100%;
      height: 100%;
      display: block;
      pointer-events: none;
    }
    .rule-btn {
      position: absolute;
      right: 0;
      top: rem(30);
      width: rem(27);
      height: rem(70);
      background: url(https://g.smartcinema.com.cn/images/bf54ce8240bc42ccb49a9427cbe3f92e-108-278.png);
      background-size: 100% 100%;
      font-size: rem(12);
      font-weight: 700;
      color: rgba(108, 51, 0, 1);
      line-height: rem(14);
      writing-mode: vertical-lr;
      @include flex($jus: center);
    }
  }
  nav {
    width: rem(322);
    height: rem(54);
    background: url(https://g.smartcinema.com.cn/images/b60fcfe379ee40ba952357b662295cfb-1286-216.png);
    background-size: 100% 100%;
    margin: rem(35) auto;
  }
  .sliderPro {
    margin: rem(15);
    @include flex($jus: center);
    h5 {
      font-size: rem(16);
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: rem(23);
    }
  }

  .filmImage, .video—container {
    width: rem(345);
    height: rem(210);
    display: block;
    margin: 0 auto;
    border-radius: rem(6);
    object-fit: cover;
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
  .score-title{
    font-size: rem(14);
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: rem(20);
    margin-right: rem(8);
  }
  /deep/ .sub-title {
    margin-bottom: rem(12);
    .text {
      text-indent: 0;
      font-size: rem(24);
      font-weight: 700;
      color: rgba(255, 255, 255, 1);
      line-height: rem(34);
      height: rem(34);
      &::before {
        display: none;
      }
    }
  }
  .tag-container{
    /deep/ .sub-title{
      padding-bottom: rem(5);
    }
    .tag-box{
      padding-left: rem(15);
      font-size: 0;
      overflow-x: auto;
      white-space: nowrap;
      span{
        margin-right: rem(10);
        display: inline-block;
        font-size: rem(11);
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: rem(16);
        padding: rem(4) rem(10);
        border: 1px solid #979797;
        border-radius: rem(14.5);
      }
    }
  }
  .time-container{
    width: rem(345);
    height: rem(50);
    background: #000000;
    border:rem(1) solid #F8DAAA;
    background-size: 100% 100%;
    border-radius: rem(4);
    @include flex();
    font-size: rem(14);
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    &>div{
      margin-left: rem(21);
      @include flex($jus: center);
      span{
        display: inline-block;
        width: rem(28);
        height: rem(30);
        margin: 0 rem(5);
        background: url(https://g.smartcinema.com.cn/images/9da5cbc3ad184d3d8f6b5dcbd9e863bc-56-60.png) 0 0 no-repeat;
        background-size: 100% 100%;
        font-size: rem(22);
        line-height: 1;
        font-weight: bold;
        color: #40373E;
        @include flex($jus: center);
      }
    }
    .date-btn{
      width: rem(106);
      height: rem(50);
      margin-left: 0;
      background: url(https://g.smartcinema.com.cn/images/3717e0ca41224c29b8c3b9a0bb1af086-212-100.png) 0 0 no-repeat;
      background-size: contain;
      font-size: rem(16);
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #40373E;
      line-height: rem(22);
      text-indent: rem(12);
    }
    .subscribed{
      background: url(https://g.smartcinema.com.cn/images/063403a4dc864f7e867426e16997ace3-212-100.png) 0 0 no-repeat;
      background-size: contain;
      color: #999999;
    }
  }
  /deep/ .button,.time-container {
    position: fixed;
    bottom: rem(30);
    left: 0;
    right: 0;
    margin: auto;
    z-index: 10;
    button {
      height: rem(40);
      background: url(https://g.smartcinema.com.cn/images/3882c4e8517142648caa0147b17d5536-1380-160.png);
      background-size: 100% 100%;
      color: rgba(64, 55, 62, 1);
    }
  }
  .border-none{
    border-right: none;
  }
  .margin-none{
    &>div{
      margin: 0;
    }
  }
  .disable{
    /deep/ button {
      height: rem(40);
      background: #666666;
      background-size: 100% 100%;
      color: #999999;
    }
  }
  /deep/ .filmDesc {
    width: rem(345);
    margin: auto;
    .ellipsis-content {
      color: rgba(236, 236, 236, 1);
      font-weight: 400;
      text-align: justify;
    }
    .ellipsis-more {
      background-color: rgba(17, 17, 17, 1);
    }
    .ellipsis-fold-text {
      font-size: rem(14);
    }
  }
  .actor-container {
    margin-top: rem(5);
    /deep/ .name {
      color: #ffffff !important;
      line-height: 1 !important;
      height: rem(16) !important;
    }
  }
  .score {
    margin: rem(10) rem(15) 0;
    @include flex($jus: flex-start);
    & > span {
      font-size: rem(14);
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #ffffff;
      line-height: rem(20);
      margin-right: rem(8);
    }
    /deep/ .star-main {
      margin: 0;
    }
  }
  .loadmore-item{
    /deep/ .star-full{
      margin-right: rem(3);
    }
  }
  .tab-container {
    margin: rem(35) rem(15) rem(27);
    @include flex($jus: space-between,$ali:flex-end);
    .tabs{
      &>span {
        margin-right: rem(30);
        font-size: rem(20);
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #999999;
        line-height: rem(28);
      }
      .tab-title-active {
        font-size: rem(24);
        font-weight: bold;
        color: #ffffff;
        line-height: rem(33);
      }
    }

    .icons{
      float: right;
      span{
        display: inline-block;
        width: rem(24);
        height: rem(24);
      }
      .reward{
        background: url(https://g.smartcinema.com.cn/images/ade884c7f7c94bcc8dbde0eb7a4dd29b-48-48.png) 0 0 no-repeat;
        background-size: 100% 100%;
      }
      .refund{
        margin-left: rem(24);
        background: url(https://g.smartcinema.com.cn/images/b94785a144cf46ecad27b7d89e476636-48-48.png) 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .info {
    width: rem(345);
    margin: rem(25) auto rem(4);
    @include flex();
    article {
      font-size: rem(12);
      font-weight: 300;
      color: rgba(255, 255, 255, 1);
      line-height: rem(17);
      span {
        font-size: rem(12);
        line-height: rem(14);
        color: rgba(255, 49, 74, 1);
      }
    }
  }
  .rule-container {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.66);
    z-index: 999;
    .rule-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .rule {
        width: rem(300);
        height: rem(432);
        background: #fff;
        border-radius: rem(8);
        h2 {
          height: rem(60);
          border-bottom: #e6e6e6 solid rem(1);
          @include flex($jus: center);
          .title {
            height: rem(31);
            font-size: rem(22);
            font-weight: 500;
            color: rgba(108, 51, 0, 1);
            line-height: rem(31);
            padding: 0 rem(53);
            background: url(https://g.smartcinema.com.cn/images/c08cea1e39f74b51a2dced3e60f3ec0f-152-72.png)
                0 center no-repeat,
              url(https://g.smartcinema.com.cn/images/94e3904ce27f42b6929a53ebdd1007d3-152-72.png)
                right center no-repeat;
            background-size: rem(38) rem(18);
          }
        }
        .context-container {
          margin: rem(20) rem(23) rem(14);
          height: rem(338);
          overflow: hidden;
          .context-wrapper {
            height: 100%;
            overflow-y: auto;
            text-align: justify;
            p {
              font-size: rem(14);
              font-weight: 500;
              color: #999999;
              line-height: rem(24);
              &.subtitle {
                color: #333333;
              }
            }
          }
        }
      }
      .close {
        margin: rem(20) auto 0;
        width: rem(30);
        height: rem(30);
        background: url(https://g.smartcinema.com.cn/images/bcc537e4bd7c426493cc5440fb992249-120-120.png);
        background-size: 100% 100%;
      }
    }
  }
  .comment-btn{
    position: fixed;
    right: rem(15);
    bottom:rem(110);
    width: rem(58);
    height: rem(58);
    background: url(https://g.smartcinema.com.cn/images/fdc4a1248697443d9c53e4970a954e2d-116-116.png) 0 0 no-repeat;
    background-size: 100% 100%;
    z-index: 100;
  }
}
</style>
