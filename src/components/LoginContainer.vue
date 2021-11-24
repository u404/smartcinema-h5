<template>
  <section class="login-cover" v-if="visible">
    <div class="login-container">
      <div class="login-box">
        <div class="login-item-title">
          <img src="https://g.smartcinema.com.cn/images/f77200b9285c42688b3b0d61314cb3ab-56-56.png" />
          <span>{{ islogin ? "已绑定手机号" : "手机号领票" }}</span>
        </div>
        <div class="login-phone-number" v-if="islogin" >{{phoneNumber}}</div>
        <div class="login-item-phone login-item-border" v-if="!islogin">
          <span class="label">+86</span>
          <input name="phone" v-model="mobile" type="tel" v-rule="'number'" pattern="[0-9]*" maxlength="11" placeholder="请输入手机号" v-validate="[{rule: 'require', errMsg:'请输入手机号'}, 'phone']" />
        </div>
        <div class="login-item-code login-item-border" v-if="!islogin">
          <span class="label">验证码</span>
          <input type="text" name="smsCode" v-rule="'number'" pattern="[0-9]*" maxlength="4" v-model="smsCode" placeholder="请输入验证码" v-validate="[{rule: 'require', errMsg:'请输入验证码'}, 'smsCode']" />
          <span class="code" v-if="!countdownSecond" @click="sendSmscode">{{smscodeSended ? "再次获取": "获取验证码"}}</span>
          <span class="code disable" v-else>{{countdownSecond}}s</span>
        </div>
        <div class="login-item-code login-item-border" v-if="needVerifyCode">
          <span class="label">图形码</span>
          <input class="verifycode-input" name="verifyCode" type="text" v-rule="'number|letter'" pattern="[A-Za-z0-9]*" maxlength="4" placeholder="图形验证码" v-validate:verifyCode="[{rule: 'require', errMsg:'请输入图形验证码'}]" v-model="verifycode"/>
          <img :src="verifyImg" />
        </div>
        <!-- error -->
        <div class="error-tips" v-show="errorTipsShow">
          <template >{{errorMsg}}</template>
        </div>
        <div class="login-btn" @click="login">立即领取</div>
        <div class="layout-btn" v-if="islogin" @click="layout" >解除绑定</div>
      </div>
      <p class="login-close-btn" @click="$emit('close')"></p>
    </div>
  </section>
</template>

<script>
import utils from "@/common/scripts/utils"
import axios from "@sc/lib-axios"
import { mapMutations } from "vuex"

export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    islogin: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      errorTipsShow: false,
      smscodeSended: false,
      progressing: false,
      needVerifyCode: false,
      countdownSecond: 0,
      verifyImgLoading: false,
      verifyImg: "",
      verifycode: "",
      errorMsg: ""
    }
  },
  computed: {
    phoneNumber () {
      return this.userInfo.uMobile.replace(/^(\d{3})\d*(\d{4})$/, "$1****$2")
    }
  },
  watch: {
    smscode (v, ov) {
      if (!/^\d*$/.test(v)) {
        this.smscodeInput = ov
      }
    },
    mobile (v, ov) {
      if (!/^\d*$/.test(v)) {
        this.mobile = ov
      }
    },
    verifycode (v, ov) {
      if (!/^[A-Za-z0-9]*$/.test(v)) {
        this.verifycodeInput = ov
      }
    }
  },
  mounted () {
    this.bindErrorTips()
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "RECORD_USERCODE", "LOGOUT"
    ]),
    bindErrorTips () {
      this.$validate.addListener(error => {
        this.errorMsg = (error && error.errMsg) || ""
        this.errorTipsShow = !!error
      })
    },
    sendSmscode () {
      if (this.progressing) return
      if (this.needVerifyCode && !this.$validate.exec("verifyCode")) return
      if (this.$validate.exec("phone")) {
        this.progressing = true
        const loading = this.$toast.showLoading()
        this.$services.user.sendSMSCode({ mobile: this.mobile, code: this.verifycode }).then(res => {
          switch (parseInt(res.status, 10)) {
            case 0: {
              this.smscodeTimes = +res.num
              utils.countdown({
                timechange: (timedata) => {
                  this.countdownSecond = Math.ceil(timedata.remain / 1000)
                }
              })
              this.smscodeSended = true
              break
            }
            case 1: {
              this.verifyImg = res.codeUrl
              this.$validate.setError({ errMsg: "图形验证码错误" })
              break
            }
            case 2: {
              this.refreshVerifyCode()
              this.needVerifyCode = true
              this.$validate.setError({ errMsg: "请输入图形验证码" })
              break
            }
            default: {
              this.$validate.setError({ errMsg: "请求出错" })
            }
          }
        }).catch(err => {
          this.$validate.setError({ errMsg: err.msg })
        }).finally(() => {
          this.progressing = false
          this.$toast.close(loading)
        })
      }
    },
    refreshVerifyCode () {
      if (!this.$validate.exec("phone")) return
      if (this.verifyImgLoading) return
      this.verifyImgLoading = true
      this.$services.user.getVerifyImg({ mobile: this.mobile }).then(res => {
        this.verifyImgLoading = false
        var img = new Image()
        img.onload = () => {
          this.verifyImg = img.src
        }
        img.src = res.source
      }).catch(err => {
        this.verifyImgLoading = false
        this.$validate.setError({ errMsg: err.msg })
      })
    },
    async login () {
      if (this.islogin) {
        this.$emit("success", this.userInfo)
        return
      }
      if (!this.$validate.exec("smsCode")) return
      if (this.needVerifyCode && !this.$validate.exec("verifyCode")) return
      if (this.progressing) return
      this.progressing = true
      const loading = this.$toast.showLoading()
      if (this.$validate.exec("phone") && this.$validate.exec("smsCode")) {
        let submitData = {
          mobile: this.mobile,
          code: this.smsCode,
          userCode: this.userCode,
          sourceType: 1
        }
        // eslint-disable-next-line no-unused-vars
        let [err, data] = await utils.to(this.$services.user.loginByCode(submitData))
        this.$toast.close(loading)
        if (err) {
          this.progressing = false
          this.$validate.setError({ errMsg: err.msg })
          return
        }
        this.RECORD_USERINFO(data)
        this.userInfoRecord(data)
        this.$emit("success", this.userInfo)
      } else {
        this.$toast.close(loading)
        this.progressing = false
      }
    },
    layout () {
      this.LOGOUT()
    },
    async userInfoRecord ({ uId, uToken, uMobile }) {
      this.$sensors.login(uId)
      utils.cookie.set("token", uToken, ".smartcinema.com.cn", "/", 7000) // 服务器端存2个小时，这里只设置7000秒
      utils.cookie.set("mobile", uMobile, ".smartcinema.com.cn", "/", 7000)
      axios.setUserToken(uToken)
      this.$sensors.track("h5_login", {
        phone: uMobile
      })
      let codePromise = utils.to(this.$services.user.getuserCode({ "X-User-Id": uId }))
      let pointsPromise = utils.to(this.$services.user.getUserPoints({ "X-User-Id": uId }))
      let [codeErr, codeData] = await codePromise
      let [pointstErr, pointsData] = await pointsPromise
      !pointstErr && this.RECORD_POINTS(pointsData)
      !codeErr && this.RECORD_USERCODE(codeData.code)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-cover{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.66);
  z-index: 99;
  @include flex($jus: center);
  .login-container{
    .login-box{
      width: rem(280);
      padding: rem(24) rem(20);
      background: #FFFFFF;
      border-radius: rem(8);
    }
    .login-close-btn{
      width: rem(30);
      height: rem(30);
      background: url(https://g.smartcinema.com.cn/images/52ac52b0b0c44a43ad58aa618f4b5112-60-60.png) 0 0 no-repeat;
      background-size: 100%;
      margin:rem(12) auto 0;
    }
    .login-phone-number{
      font-size: rem(21);
      text-align: center;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #666666;
      line-height: rem(29);
    }
    .login-item-title{
      font-size: 0;
      text-align: center;
      @include flex($jus: center);
      margin-bottom: rem(20);
      img{
        width: rem(28);
        height: rem(28);
        margin-right: rem(8);
      }
      span{
        font-size: rem(17);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: rem(24);
      }
    }
    .login-item-border{
      border-bottom: #F5F5F5 solid rem(1);
      padding: rem(10) 0;
    }
    .login-item-phone,.login-item-code{
      @include flex($ali: center);
      img{
        width: rem(88);
        height: rem(34);
      }
    }
    .login-item-phone{
      .label{
        padding-right: rem(18);
        border-right: rem(1) solid #E4E4E4;
      }
    }
    .label{
      display: block;
      white-space: nowrap;
      font-size: rem(15);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: rem(21);
      margin-right: rem(12);
    }
    input{
      min-width: 0;
      border: none;
      flex: 1;
      font-size: rem(13);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      // color: #CCCCCC;
      line-height: rem(18);
      outline: none;
    }
    .login-btn{
      width: rem(240);
      height: rem(44);
      background: url(https://g.smartcinema.com.cn/images/7cbf02f98a084c97b2efacbee5f43f8e-480-88.png) 0 0 no-repeat;
      background-size: 100%;
      font-size: rem(16);
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      margin-top: rem(30);
      color: #40373E;
      @include flex($jus: center);
    }
    .layout-btn{
      font-size: rem(16);
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: rem(22);
      text-align: center;
      margin-top: rem(12);
    }
    .code{
      display: block;
      width: rem(66);
      height: rem(24);
      padding:0 rem(2);
      border-radius: rem(12);
      border: rem(1) solid #CF9866;
      font-size: rem(11);
      line-height: rem(22);
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: #CC9361;
      white-space: nowrap;
      text-align: center;
    }
    .disable{
      border-color: #CCCCCC;
      color: #CCCCCC;
    }
  }
}
</style>
