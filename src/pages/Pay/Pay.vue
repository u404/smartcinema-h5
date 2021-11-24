<template>
  <section class="pay" v-if="product.filmName">
    <header>
      <img class="cover" :src="product.imgTagImg" />
      <article class="desc">
        <p class="name">{{product.filmName}}</p>
        <p class="tag">{{product.typeString}}{{product.fileLanguage &&  `|${product.fileLanguage}` }}</p>
        <p class="date">{{product.releaseEndTime}}</p>
      </article>
    </header>
    <ul class="pay-list">
      <li>
        <p>
          单价
          <span class="price">¥ {{product.sumPrice}}</span>
        </p>
      </li>
      <li>
        <p>
          <img
            class="icon"
            src="https://g.smartcinema.com.cn/images/275ec8cfcf03419581b2501ee8baa664-48-48.png"
          />
          微信
        </p>
        <span :class="{ check : true, checked : payType===0 }" ></span>
      </li>
    </ul>
    <div class="buy-btn">
      <p v-if="buttonText">{{buttonText}}</p>
      <v-button @click="pay" title="立即支付" v-if="accountStatus !== 2"></v-button>
    </div>
    <section class="result" v-show="isPay" >
      <ul>
        <li class="close-btn" @click="isPay = false"></li>
        <li class="result-title">请确认微信支付是否已完成</li>
        <li class="pay-success" @click.stop="paySuccessHandle"><v-button title="已完成支付，去观影"></v-button></li>
        <li class="pay-fail" @click.stop="payFailedHandle">遇到问题，重新支付</li>
      </ul>
    </section>
    <sc-confirm :closable="false" confirmTitle="购票成功" msgColor="#666666" cancelTextColor="#999999" confirmTextColor="#E8BF8F" :confirmVisiable="confirmShow" :msg="confirmStatus.msg" :cancelText="confirmStatus.cancelText" :confirmText="confirmStatus.confirmText" @cancel="confirmStatus.cancel" @confirm="confirmStatus.confirm" ></sc-confirm>
  </section>
</template>

<script>
import VButton from "@/components/VButton"
import ScConfirm from "@/components/ScConfirm"
import utils from "@/common/scripts/utils"
import { mapState } from "vuex"
import env from "@sc/lib-env"
import axios from "@sc/lib-axios"
import wx from "@sc/lib-wx"
export default {
  data () {
    return {
      payType: 0,
      isPay: false,
      orderId: "",
      times: 0,
      loading: "",
      spuId: "",
      product: {},
      isNeedHdc: false,
      skip: "normal",
      confirmShow: false,
      ticketInfo: "",
      skuId: "",
      skuIds: [],
      packId: "",
      type: "",
      filmId: ""
    }
  },
  computed: {
    ...mapState([
      "login", "accountInfo"
    ]),
    accountStatus () {
      if (this.accountInfo.status === 2) {
        this.$toast.showToast("您的账号存在异常，无法参加本次活动")
      }
      return this.accountInfo.status
    },
    buttonText () {
      let text = ""
      switch (this.skip) {
        case "shiyi2021":
          text = "国庆七天乐 看电影抽积分红包"
          break
        case "spring":
          text = "*观影有机会抽取2021元财运红包，稳赚不赔"
          break
        case "dangjian":
        case "summer2021":
          text = "看电影拿周边 积分赚不停"
          break
        case "package":
          text = this.type === "shiyi2021" ? "国庆七天乐 看电影抽积分红包" : "看电影拿周边 积分赚不停"
          break
        default:
          text = ""
          break
      }
      return text
    },
    confirmStatus () {
      let confirmData = {}
      let routerName = this.type === "dangjian" ? "party-building" : this.type === "summer2021" ? "summer" : ""
      switch (this.skip) {
        case "spring":
          confirmData = {
            confirmTitle: "购票成功",
            msg: "观看15分钟，有机会抽取<span style='color:#EF1919;'>2021元</span>红包大奖",
            cancelText: "",
            confirmText: "去观影",
            cancel: () => { this.cancleHandle() },
            confirm: () => { this.confirmHandle() }
          }
          break
        case "dangjian":
        case "summer2021":
        case "shiyi2021":
          confirmData = {
            confirmTitle: "购票成功",
            msg: `观影三分钟有机会抽取积分红包`,
            cancelText: "回首页",
            confirmText: "去观影",
            cancel: () => { this.skip === "shiyi2021" ? this.$router.replace({ name: "movie", query: { type: "shiyi2021", filmId: this.filmId } }) : this.$router.replace({ name: routerName }) },
            confirm: () => { this.confirmHandle() }
          }
          break
        case "package":
          confirmData = {
            confirmTitle: "购票成功",
            msg: `观影三分钟有机会抽取积分红包`,
            cancelText: "",
            confirmText: "去观影",
            cancel: () => { this.type === "shiyi2021" ? this.$router.replace({ name: "movie", query: { type: "shiyi2021", filmId: this.filmId } }) : this.$router.replace({ name: routerName }) },
            confirm: () => { this.type === "shiyi2021" ? this.$router.replace({ name: "movie", query: { type: "shiyi2021", filmId: this.filmId } }) : this.$router.replace({ name: routerName }) }
          }
          break
        default:
          break
      }
      return confirmData
    }
  },
  async mounted () {
    const loading = this.$toast.showLoading()
    this.spuId = this.$route.query.spuId
    this.isPay = !!this.$route.query.pay
    this.skip = this.$route.query.skip || this.skip
    this.orderId = this.$route.query.orderId || ""
    this.skuId = this.$route.query.skuId || ""
    this.packId = this.$route.query.packId || ""
    this.type = this.$route.query.type || ""
    this.filmId = this.$route.query.filmId || ""
    if (this.skip === "package") {
      this.getActivityBaseInfo(this.type).then(() => this.listFetch(this.type)).then(() => {
        this.$toast.close(loading)
      }).catch(() => {
        this.$toast.close(loading)
      })
      if (!env.os.ios) {
        new CustomEvent("SCHYUIInterface_payPackSuccess")
        window.addEventListener("SCHYUIInterface_payPackSuccess", (event) => {
          this.systemPackEvent(event.data)
        })
      }
    } else {
      let isNeedHdc = this.isNeedHdc = this.$route.query.needHdc === "activity" || false
      let sendData = isNeedHdc ? { spuId: this.spuId, isNeedHdc: "true" } : { spuId: this.spuId }
      let [err, data] = await utils.to(this.$services.order.getPaySku(sendData))
      if (err) {
        this.$toast.close(loading)
        this.$toast.showToast(err.msg)
        this.$router.go(-1)
        return
      }
      data.list.forEach(item => {
        if (this.skuId && +item.skuId === +this.skuId) {
          this.product = item
        } else if (!this.skuId && item.screenTypeVal === "12" && this.isNeedHdc) {
          this.product = item
        } else if (!this.skuId && item.screenTypeVal === "1" && !this.isNeedHdc) {
          this.product = item
        }
      })
      if (!this.product.skuId) {
        this.$toast.close(loading)
        this.$toast.showToast("暂无可购买影片")
        this.$router.go(-1)
        return
      }
      this.$toast.close(loading)
    }

    this.$sensors.track("h5_buy_page_enter", {
      sku_id: this.product.skuId,
      film_name: this.product.filmName,
      client_type: env.browser.inApp ? "App" : "SC-h5"
    })
  },
  methods: {
    systemPackEvent (obj) {
      this.packId = obj.packId
      if (!this.packId) {
        this.isPay = false
      }
    },
    // 合集购买H5支付
    packWxPayIos () {
      const loading = this.$toast.showLoading()
      let { activityId, sumPrice } = this.product
      let h5RunEnv = env.browser.inApp && env.os.ios ? 2 : 5
      this.getPackWxPay({
        activityId,
        packFee: Number(sumPrice),
        skuIds: this.skuIds.join(","),
        h5RunEnv
      }).then(res => {
        this.packId = res.packId
        let nurl = `${location.origin}${location.pathname}${location.hash.split("?")[0]}?pay=1&packId=${res.packId}&needHdc=${this.isNeedHdc ? "activity" : ""}&skip=${this.skip}&type=${this.type}${this.filmId ? "&filmId=" + this.filmId : ""}`
        let url = (env.browser.inApp && env.os.ios) ? res.mwebUrl : res.mwebUrl + `&redirect_url=${encodeURIComponent(location.origin + location.pathname + location.hash.split("?")[0] + "?pay=1&packId=" + res.packId + "&needHdc=" + (this.isNeedHdc ? "activity" : "") + "&skip=" + this.skip + "&type=" + this.type + (this.filmId ? "&filmId=" + this.filmId : ""))}`
        setTimeout(() => {
          this.$toast.close(loading)
          this.isPay = true
        }, 5000)
        env.browser.inApp && env.os.ios && location.replace(nurl)
        location.replace(url)
      }).catch(err => {
        this.$toast.close(loading)
        this.$toast.showToast(err.msg)
      })
    },
    // 安卓合集购买
    packPayAndroid () {
      const loading = this.$toast.showLoading()
      const { activityId, sumPrice } = this.product
      this.$windvane.call("SCHYUIInterface.webOpenNativePayPack", {
        activityId,
        packFee: sumPrice,
        skuIds: this.skuIds.join(",")
      }).then(res => {
      }).catch(() => {
        this.$toast.close(loading)
      })
      setTimeout(() => {
        this.isPay = true
        this.$toast.close(loading)
      }, 5000)
    },
    // 微信内合集购买
    async packPayWx () {
      let openId = utils.cookie.get("openid")
      if (!openId) {
        await utils.to(this.$services.user.getWechat(encodeURIComponent(location.href)))
        return
      }
      let { activityId, sumPrice } = this.product
      this.$services.order.getPackPayWxWallet({
        openId,
        activityId,
        packFee: Number(sumPrice),
        skuIds: this.skuIds.join(",")
      }).then(data => {
        this.packId = data.packId
        wx.config(["chooseWXPay"]).then(() => {
        // 调用微信支付
          window.wx.chooseWXPay({
            appId: data.appId, // 公众号名称，由商户传入
            timestamp: String(data.timeStamp), // 时间戳，自1970年以来的秒数
            nonceStr: data.nonceStr, // 随机串
            package: data.package,
            signType: data.signType, // 微信签名方式
            paySign: data.paySign, // 微信签名
            success: (res) => {
              if (res.errMsg === "chooseWXPay:ok") {
                this.paySuccessHandle()
              } else if (res.errMsg === "chooseWXPay:fail") {
                this.$toast.showToast("支付失败")
              }
            },
            cancel: () => {
              this.$toast.showToast("支付取消")
            },
            fail: (res) => {
              this.$toast.showToast(res.message || "支付失败")
            }
          })
        })
      }).catch(err => {
        this.$toast.showToast(err.msg)
      })
    },
    // 获取合集购买基本信息
    getActivityBaseInfo (type) {
      return this.$services.operation.getActivityBasic({ type }).then(res => {
        this.product = {
          filmName: res.packTitle,
          imgTagImg: res.packImage,
          typeString: res.packSubTitle,
          sumPrice: res.packPrice,
          activityId: res.id
        }
      })
    },
    // 获取活动影片信息
    listFetch (type) {
      return this.$services.operation.getActivityFilms({ type }).then(res => {
        res.forEach(item => {
          this.skuIds.push(item.skuId)
        })
      })
    },
    getPackWxPay (data) {
      return this.$services.order.getPackWxPay(data)
    },
    async createOrderHandle (skuId, cb) {
      const loading = this.$toast.showLoading()
      let [err, data] = await utils.to(this.$services.order.createOrder({ skuId, buyNumber: "1", isH5: "true" }))
      if (err) {
        this.$toast.close(loading)
        this.$toast.showToast(err.msg)
      } else {
        this.$toast.close(loading)
        this.orderId = data.id
        if (!env.browser.inApp) {
          cb && cb(this.orderId, this.product.skuId)
        } else {
          let loading = this.$toast.showLoading()
          this.$windvane.call("SCHYDataInterface.getUserInfo").then((res) => {
            if (res.success && res.data.u_token) {
              axios.setUserToken(res.data.u_token)
              this.$toast.close(loading)
              cb && cb(this.orderId, this.product.skuId)
            } else {
              this.$windvane.call("SCHYUIInterface.showLoginPage", {
                refreshWhenLogin: "0"
              }).then(res => {
                if (res.success) {
                  axios.setUserToken(res.data.u_token)
                  this.$toast.close(loading)
                  cb && cb(this.orderId, this.product.skuId)
                }
              })
            }
          })
        }
      }
    },
    pay () {
      if (!this.login && !env.browser.inApp) {
        this.$router.push({ name: "login" })
        return
      }
      if (this.skip === "package") {
        if (env.browser.WeChat) {
          this.packPayWx()
        } else if (env.browser.inApp && !env.os.ios) {
          this.packPayAndroid()
        } else {
          this.packWxPayIos()
        }
      } else {
        let skuId = this.product.skuId
        this.$sensors.track("h5_order_pay_click", {
          sku_id: skuId,
          film_name: this.product.filmName,
          pay_type: "wechat",
          client_type: env.browser.inApp ? "App" : "SC-h5"
        })
        let cb
        if (this.product.sumPrice === 0) {
          cb = this.directPayHandle
        } else if (env.browser.WeChat) {
          cb = this.payWxWalletHandle
        } else if (env.browser.inApp && !env.os.ios) {
          cb = this.wxPayAndroidHandle
        } else {
          cb = this.wxPayIosHandle
        }
        this.createOrderHandle(skuId, cb)
      }
    },
    // 0元支付，直接购买
    async directPayHandle () {
      const loading = this.$toast.showLoading()
      let [err, data] = await utils.to(this.$services.order.directPay({ skuId: this.product.skuId, buyNumber: "1", payType: 0 }))
      if (err) {
        this.$toast.close(loading)
        this.$toast.showToast(err.msg)
        return
      }
      this.$toast.close(loading)
      this.toPlayPage(data.paymentResponseDTO.tickets[0], data.paymentResponseDTO.filmId)
    },
    // 微信内支付
    async payWxWalletHandle (orderId) {
      let openId = utils.cookie.get("openid")
      if (!openId) {
        await utils.to(this.$services.user.getWechat(encodeURIComponent(location.href)))
        return
      }
      const loading = this.$toast.showLoading()
      // 生成预订单
      let [err, data] = await utils.to(this.$services.order.payWxWallet({ orderId, openId }))
      this.$toast.close(loading)
      if (err) {
        this.$toast.showToast(err)
        return
      }
      wx.config(["chooseWXPay"]).then(() => {
        // 调用微信支付
        window.wx.chooseWXPay({
          appId: data.appId, // 公众号名称，由商户传入
          timestamp: String(data.timeStamp), // 时间戳，自1970年以来的秒数
          nonceStr: data.nonceStr, // 随机串
          package: data.package,
          signType: data.signType, // 微信签名方式
          paySign: data.paySign, // 微信签名
          success: (res) => {
            if (res.errMsg === "chooseWXPay:ok") {
              this.paySuccessHandle()
            } else if (res.errMsg === "chooseWXPay:fail") {
              this.$toast.showToast("支付失败")
            }
          },
          cancel: () => {
            this.$toast.showToast("支付取消")
          },
          fail: (res) => {
            this.$toast.showToast(res.message || "支付失败")
          }
        })
      })
    },
    // 安卓App内支付
    async wxPayAndroidHandle (orderId, skuId) {
      const loading = this.$toast.showLoading()
      this.$windvane.call("SCHYUIInterface.webOpenNativePay", {
        skuId,
        buyNumber: "1",
        payType: "3",
        orderId
      }).then(res => {
      }).catch(() => {
        this.$toast.close(loading)
      })
      setTimeout(() => {
        this.isPay = true
        this.$toast.close(loading)
      }, 5000)
    },
    // ios APP及微信外支付
    async wxPayIosHandle (orderId) {
      const loading = this.$toast.showLoading()
      let h5RunEnv = env.browser.inApp && env.os.ios ? 2 : 5
      let [err, data] = await utils.to(this.$services.order.wxPay({ orderId, h5RunEnv }))
      if (err) {
        this.$toast.close(loading)
        this.$toast.showToast(err.msg)
        return
      }
      let nurl = `${location.origin}${location.pathname}${location.hash.split("?")[0]}?pay=1&orderId=${orderId}&spuId=${this.spuId}&needHdc=${this.isNeedHdc ? "activity" : ""}&skip=${this.skip}&skuId=${this.skuId}&type=${this.type}${this.filmId ? "&filmId=" + this.filmId : ""}`
      let url = (env.browser.inApp && env.os.ios) ? data.mwebUrl : data.mwebUrl + `&redirect_url=${encodeURIComponent(location.origin + location.pathname + location.hash.split("?")[0] + "?pay=1&orderId=" + orderId + "&spuId=" + this.spuId + "&needHdc=" + (this.isNeedHdc ? "activity" : "") + "&skip=" + this.skip + "&skuId=" + this.skuId + "&type=" + this.type + (this.filmId ? "&filmId=" + this.filmId : ""))}`
      setTimeout(() => {
        this.isPay = true
        this.$toast.close(loading)
      }, 5000)
      env.browser.inApp && env.os.ios && location.replace(nurl)
      location.replace(url)
    },
    toPlayPage (ticketNo, filmId) {
      if (env.browser.inApp) {
        const schemeURL = `smartcinema://playMovie?ticketNum=${ticketNo}&ticketNo=${ticketNo}&filmId=${filmId}`
        this.$windvane.call("SCHYUIInterface.openNativePage", { schemeURL })
        setTimeout(() => {
          this.$router.back(-1)
        }, 1000)
      } else {
        if (this.skip === "shiyi2021") {
          this.$router.replace({ name: "movie", query: { type: "shiyi2021", filmId: this.filmId } })
          return
        }
        if (this.skip === "dangjian" || this.skip === "summer2021") {
          this.$router.push({ name: "play", query: { filmId, ticketNo, type: this.skip } })
          return
        }
        this.skip === "spring" ? this.$callapp.gotoPage({
          pathname: "web",
          params: {
            stringUrl: encodeURIComponent(`${location.origin}/index.html#/operation/spring?source=banner`)
          }
        }) : this.$callapp.gotoPage()
      }
    },
    directRightUrl () {
      let { href, protocol, host, search, hash } = window.location
      const pathname = "/index.html" // 解决支付路径问题添加的前缀
      search = search || "?"
      hash = hash || "#/"
      let newHref = `${protocol}//${host}${pathname}${search}${hash}`
      if (newHref !== href) {
        window.location.replace(newHref)
      }
    },
    // 支付成功
    async paySuccessHandle () {
      this.loading = this.$toast.showLoading()
      this.skip === "package" ? this.getPackPayResult(5, true) : this.getResultHandle(5, true)
    },
    // 打包购买结果查询
    async getPackPayResult (count, success) {
      let timer
      // eslint-disable-next-line no-unused-vars
      let [err, data] = await utils.to(this.$services.order.getPackWxPayNotify({ packId: this.packId }))
      if (err) {
        this.times++
        timer = setTimeout(() => {
          if (this.times >= count) {
            this.$toast.close(this.loading)
            if (success) {
              this.$toast.showToast("查询失败，请重试")
            } else {
              this.isPay = false
            }
            this.times = 0
            return false
          } else {
            this.getPackPayResult(count, success)
            clearTimeout(timer)
          }
        }, 2000)
      } else {
        if (this.type === "shiyi2021") {
          this.$sensors.track("activity_purchase_success", {
            activity_id: "20211001",
            activity_name: "2021国庆七天乐活动",
            sku_id: "116",
            film_name: this.product.filmName,
            purchase_type: "合集购买",
            enter_type: this.inApp ? "站内" : "站外"
          })
        }
        this.$toast.close(this.loading)
        this.isPay = false
        this.confirmShow = true
      }
    },
    // 支付结果查询
    async getResultHandle (count, success) {
      let timer
      let [err, data] = await utils.to(this.$services.order.getWxPayNotify({ orderId: this.orderId }))
      if (err) return false
      if (!data.tickets || !data.tickets.length) {
        this.times++
        timer = setTimeout(() => {
          console.log(this.times, count)
          if (this.times >= count) {
            this.$toast.close(this.loading)
            if (success) {
              this.$toast.showToast("查询失败，请重试")
            } else {
              this.isPay = false
              this.orderId = ""
            }
            this.times = 0
            this.$sensors.track("h5_order_pay_resulte", {
              sku_id: this.product.skuId,
              film_name: this.product.filmName,
              pay_type: "wechat",
              resulte: "failed"
            })
            return false
          } else {
            this.getResultHandle(count, success)
            clearTimeout(timer)
          }
        }, 2000)
      } else {
        this.$toast.close(this.loading)
        switch (this.skip) {
          case "spring":
          case "shiyi2021":
            this.isPay = false
            this.confirmShow = true
            this.ticketInfo = data
            if (this.skip === "shiyi2021") {
              this.$sensors.track("activity_purchase_success", {
                activity_id: "20211001",
                activity_name: "2021国庆七天乐活动",
                sku_id: this.product.skuId,
                film_name: this.product.filmName,
                purchase_type: "单片购买",
                enter_type: this.inApp ? "站内" : "站外"
              })
            }
            break
          case "normal":
            this.$sensors.track("h5_order_pay_resulte", {
              sku_id: this.product.skuId,
              film_name: this.product.filmName,
              pay_type: "wechat",
              resulte: "ok"
            })
            this.toPlayPage(data.tickets[0], data.filmId)
            break
          case "tues":
            this.$sensors.track("activity_purchase_success", {
              activity_id: "20201020",
              activity_name: "周二特价日",
              sku_id: this.product.skuId,
              film_name: this.product.filmName
            })
            this.toPlayPage(data.tickets[0], data.filmId)
            break
          case "dangjian":
          case "summer2021":
            this.toPlayPage(data.tickets[0], data.filmId)
            break
          case "ticket":
            this.$sensors.track("activity_purchase_success", {
              activity_id: "20201030",
              activity_name: "五夜点映活动",
              sku_id: this.product.skuId,
              film_name: this.product.filmName
            }, () => {
              this.$router.replace({ name: "tickets" })
            })
            break
          case "week":
            this.$sensors.track("activity_purchase_success", {
              activity_id: "20201030",
              activity_name: "五夜点映活动",
              sku_id: this.product.skuId,
              film_name: this.product.filmName
            }, () => {
              this.$router.replace({ name: "week" })
            })
            break
          case "collection":
            const loading = this.$toast.showLoading()
            let codes = []
            let [listErr, listData] = await utils.to(this.$services.operation.getActivityFilms({ type: "shiyi" }))
            if (!listErr) {
              listData.forEach(item => {
                codes.push(item.giveCode)
              })
            } else {
              this.$toast.close(loading)
              this.$toast.showToast("查询失败，请重试")
            }
            // eslint-disable-next-line no-unused-vars
            let [acceptErr, acceptData] = await utils.to(this.$services.order.acceptTicket({ giveCode: codes.join(",") }))
            this.$sensors.track("activity_purchase_success", {
              activity_id: "20201001",
              activity_name: "国庆打包购买活动",
              sku_id: this.product.skuId,
              film_name: this.product.filmName
            })
            this.$toast.close(loading)
            if (!acceptErr) {
              this.$router.replace({ name: "national" })
            } else {
              this.$toast.showToast("查询失败，请重试")
            }
            break
          default:
            break
        }
      }
    },
    // 点击支付失败，弹窗关闭
    payFailedHandle () {
      this.loading = this.$toast.showLoading()
      this.skip === "package" ? this.getPackPayResult(2, false) : this.getResultHandle(2, false)
    },
    cancleHandle () {
      this.$router.replace({ name: "spring" })
    },
    confirmHandle () {
      this.toPlayPage(this.ticketInfo.tickets[0], this.ticketInfo.filmId)
    }
  },
  components: {
    VButton, ScConfirm
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.indexOf("micromessenger") !== -1) {
        vm.directRightUrl()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.pay {
  height: 100%;
  background-color: #ffffff;
  header {
    padding: getRem375(30) getRem375(15);
    display: flex;
    img {
      display: block;
      width: getRem375(63);
      height: getRem375(90);
      border-radius: getRem375(2);
      margin-right: getRem375(12);
    }
    .desc {
      @include flex($flow: column, $jus: space-between, $ali: flex-start);
      .name {
        height: getRem375(28);
        font-size: getRem375(20);
        font-weight: 700;
        color: rgba(17, 17, 17, 1);
        line-height: getRem375(28);
      }
      .tag {
        height: getRem375(17);
        font-size: getRem375(12);
        font-weight: 300;
        color: rgba(102, 102, 102, 1);
        line-height: getRem375(17);
      }
      .date {
        height: getRem375(14);
        font-size: getRem375(12);
        font-weight: 400;
        color: rgba(238, 47, 47, 1);
        line-height: getRem375(14);
        margin-bottom: getRem375(5);
      }
    }
  }
  .pay-list {
    border-bottom: getRem375(1) solid rgba(227, 227, 227, 1);
    li {
      width: getRem375(345);
      margin: 0 auto;
      @include flex;
      border-top: getRem375(1) solid rgba(227, 227, 227, 1);
      padding: getRem375(17) 0;
      p {
        height: getRem375(22);
        font-size: getRem375(16);
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: getRem375(22);
        @include flex;
      }
      .price {
        color: rgba(255, 49, 74, 1);
        padding-left: getRem375(5);
      }
      .icon {
        width: getRem375(24);
        height: getRem375(24);
        margin-right: getRem375(17);
        pointer-events: none;
      }
      .check {
        display: block;
        width: getRem375(20);
        height: getRem375(20);
        background: url(https://g.smartcinema.com.cn/images/92ef3f1441734f77bf780dbcc34ff780-40-40.png)
          0 0 no-repeat;
        background-size: 100% 100%;
      }
      .checked {
        background: url(https://g.smartcinema.com.cn/images/cee8f0899d7a4e32af0e37654c1f0ec8-40-40.png)
          0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .buy-btn{
    position: fixed;
    bottom: getRem375(40);
    left: 0;
    right: 0;
    margin: auto;
    p{
      font-size: rem(15);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FF314A;
      line-height: rem(21);
      margin-bottom: rem(7);
      text-align: center;
    }
  }

  .result{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0,0,0,.5);
    ul{
      position: absolute;
      width: getRem375(285);
      transform: translate(-50%, -50%);
      top: 50%;
      left: 50%;
      background: #ffffff;
      border-radius: getRem375(4);
      padding: getRem375(40) getRem375(22) getRem375(20);
      .close-btn{
        position: absolute;
        right: rem(-30);
        top: rem(-30);
        width: rem(30);
        height: rem(30);
        background: url(https://g.smartcinema.com.cn/images/973ac889e8074a7ea60bf9620ce86747-62-62.png) 0 0 no-repeat;
        background-size: 100% 100%;
      }
      li{
        @include flex($jus: center);
        color: rgba(17, 17, 17, 1);
        font-size: getRem375(18);
        &:nth-of-type(2){
          height:getRem375(25);
          font-size:getRem375(18);
          font-weight:700;
          color:rgba(51,51,51,1);
          line-height:getRem375(25);
        }
        &:last-of-type{
          height:getRem375(22);
          font-size:getRem375(16);
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:getRem375(22);
        }
        /deep/ .button {
          position: relative;
          bottom: 0;
          margin: getRem375(35) 0 getRem375(20);
          button{
            width: getRem375(240);
          }
        }
      }
    }
  }
}
</style>
