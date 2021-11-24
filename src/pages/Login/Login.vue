<template>
  <section :class="{'login': true, sloganVisible}">
    <slogan />
    <header class="logo"></header>
    <section class="group">
      <p class="number">+86</p>
      <input name="phone" v-model="mobile" type="tel" v-rule="'number'" pattern="[0-9]*" maxlength="11" placeholder="请输入手机号" v-validate="[{rule: 'require', errMsg:'请输入手机号'}, 'phone']" />
    </section>
    <section  class="group" v-if="loginType === 0 && needVerifyCode">
      <input class="verifycode-input" name="verifyCode" type="text" v-rule="'number|letter'" pattern="[A-Za-z0-9]*" maxlength="4" placeholder="图形验证码" v-validate:verifyCode="[{rule: 'require', errMsg:'请输入图形验证码'}]" v-model="verifycode"/>
      <img class="code verify-image" @click="refreshVerifyCode" :src="verifyImg" alt="刷新图形验证码" />
    </section>
    <section  class="group" v-if="loginType === 0">
      <input type="text" name="smsCode" v-rule="'number'" pattern="[0-9]*" maxlength="4" v-model="smsCode" placeholder="请输入验证码" v-validate="[{rule: 'require', errMsg:'请输入验证码'}, 'smsCode']" />
      <p class="code" v-if="!countdownSecond" @click="sendSmscode">{{smscodeSended ? "再次获取": "获取验证码"}}</p>
      <p class="code disabled" v-else>{{countdownSecond}}s后再次发送</p>
    </section>
    <section  class="group" v-else>
      <input type="password" name="password" v-model="password" placeholder="请输入密码"  maxlength="16" v-validate="[{rule: 'require', errMsg:'请输入密码'}, 'password']" />
    </section>
    <!-- error -->
    <div class="error-tips" v-show="errorTipsShow">
      <template >{{errorMsg}}</template>
    </div>
    <button @click.stop="login" :class="{ 'login-btn': true, 'active': ((loginType === 0 && smsCode.length >= 4) || (loginType === 1 && password.length >= 8))}">开启观影之旅</button>
    <p class="login-type" @click="typeChangeHandle">{{loginType===0?"密码登录":"验证码登录"}}</p>
    <section class="agreement">
      登录即代表您已同意<span @click="toAgreement('agreement')">《移动电影院用户协议》</span>和 <span @click="toAgreement('privacy')">《移动电影院隐私政策》</span>
    </section>
  </section>
</template>

<script>
import Slogan from "@/components/Slogan"
import utils from "@/common/scripts/utils"
import { mapState, mapMutations } from "vuex"
import axios from "@sc/lib-axios"
import MD5 from "md5.js"
export default {
  components: {
    Slogan
  },
  data () {
    return {
      loginType: 0,
      smsCode: "",
      password: "",
      errorTipsShow: false,
      errorMsg: "",
      mobile: "",
      smscodeSended: false,
      progressing: false,
      smscodeTimes: 0,
      countdownSecond: 0,
      needVerifyCode: false,
      verifyImgLoading: false,
      verifyImg: "",
      verifycode: ""
    }
  },
  computed: {
    ...mapState([
      "sloganVisible", "shareInfo", "userCode"
    ])
  },
  methods: {
    ...mapMutations([
      "RECORD_USERINFO", "RECORD_POINTS", "RECORD_USERCODE"
    ]),
    // 用户协议
    toAgreement (type) {
      window.location.href = type === "agreement" ? "https://h5.smartcinema.com.cn/agreement/index.html" : "https://h5.smartcinema.com.cn/privacy/privacy.html"
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
    bindErrorTips () {
      this.$validate.addListener(error => {
        this.errorMsg = (error && error.errMsg) || ""
        this.errorTipsShow = !!error
      })
    },
    typeChangeHandle () {
      this.loginType = Number(!this.loginType)
    },
    async login () {
      if (!this.$validate.exec("password")) return
      if (!this.$validate.exec("smsCode")) return
      if (this.needVerifyCode && !this.$validate.exec("verifyCode")) return
      if (this.progressing) return
      this.progressing = true
      const loading = this.$toast.showLoading()
      let submitData
      if (this.loginType === 0 && this.$validate.exec("phone") && this.$validate.exec("smsCode")) {
        submitData = {
          mobile: this.mobile,
          code: this.smsCode,
          userCode: this.userCode,
          sourceType: 1
        }
      } else if (this.loginType === 1 && this.$validate.exec("phone") && this.$validate.exec("password")) {
        submitData = {
          mobile: this.mobile,
          password: new MD5().update(this.password).digest("hex"),
          type: 1
        }
      } else {
        this.$toast.close(loading)
        this.progressing = false
      }
      // eslint-disable-next-line no-unused-vars
      let err, data
      this.loginType === 0 ? ([err, data] = await utils.to(this.$services.user.loginByCode(submitData))) : ([err, data] = await utils.to(this.$services.user.login(submitData)))
      this.$toast.close(loading)
      if (err) {
        this.progressing = false
        this.$validate.setError({ errMsg: err.msg })
        return
      }
      this.RECORD_USERINFO(data)
      this.userInfoRecord(data)
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
      !codeErr && codeData.code && this.RECORD_USERCODE(codeData.code)
      let url = `${location.origin}${location.pathname}?ucode=${codeData.code || ""}#${this.$route.query.redirect || ""}`
      location.replace(url)
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
    console.log(this.$route.query.redirect)
  }
}
</script>

<style lang="scss" scoped>
.login {
  padding: rem(56)  rem(15) 0;
  background: rgba(247, 247, 247, 1);
  min-height: 100%;
  .logo {
    width: rem(133);
    height: rem(80);
    margin: rem(60) auto  rem(50);
    background: url(https://g.smartcinema.com.cn/images/cf058674f98e4e8f9c2909fa3eb3e0a3-266-160.png);
    background-size:100% 100%;
    @include flex($jus: center);
  }
  .login-btn{
    width: rem(345);
    height: rem(44);
    margin: 0 auto rem(20);
    background:rgba(230,230,230,1);
    border-radius:rem(4);
    @include flex($jus: center);
    font-size:rem(16);
    font-weight:500;
    color:rgba(153,153,153,1);
  }
  .active{
    background:rgba(204,140,68,1);
    color: #ffffff;
  }
  .group{
    @include flex();
    width: rem(345);
    height: rem(44);
    margin: 0 auto rem(20);
    .number,.code{
      width: rem(60);
      height:rem(44);
      font-size:rem(14);
      font-weight:400;
      color:rgba(51,51,51,1);
      background: #ffffff;
      margin-right: rem(5);
      border-radius:rem(4);
      @include flex($jus: center);
    }
    .code{
      width: rem(100);
      color:rgba(204,140,68,1);
      margin-left: rem(5);
    }
    .verify-image{
      display: block;
      height: 100%;
      object-fit: contain;
    }
    input{
      height: 100%;
      box-sizing: border-box;
      padding-left: rem(15);
      border: none;
      background:rgba(255,255,255,1);
      border-radius:rem(4);
      flex: 1;
    }
    .disabled{
      color: #666;
      cursor: not-allowed;
    }
  }
  .login-type{
    text-align: center;
    height:rem(20);
    font-size:rem(14);
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:rem(20);
  }
  .agreement{
    width: rem(243);
    margin: rem(144) auto 0;
    padding-bottom: rem(34);
    text-align: center;
    font-size:rem(12);
    font-weight:400;
    color:rgb(153, 153, 153);
    line-height:rem(24);
    span{
      color: #333333;
    }
  }
}
</style>
