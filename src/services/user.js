import utils from "../common/scripts/utils"
// import qs from "qs"
import axios from "@sc/lib-axios"

import env from "@sc/lib-env"

const baseURL = {
  test: "https://api-test.smartcinema.com.cn",
  pre: "https://api-pre.smartcinema.com.cn",
  beta: "https://api-beta.smartcinema.com.cn",
  prod: "https://api.smartcinema.com.cn"
}[env.env]

let createUuid = () => {
  var s = []
  var hexDigits = "0123456789abcdef"
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = "4"
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23]
  var uuid = s.join("")
  return uuid
}
// 登录接口
const login = (data) => {
  return axios.post("/web/outSiteLogin", data)
}
// 登录接口
const loginByCode = (data) => {
  return axios.post("/web/login", data)
}
// 跳转到微信授权
const wxLogin = (returnUrl) => {
  let url = returnUrl || location.href
  location.replace((baseURL || "https://api.smartcinema.com.cn") + "/web/getWeChat?url=" + url)
}

const goBack = () => {
  let returnUrl = utils.cookie.get("rUrl")
  if (returnUrl) {
    location.replace(returnUrl)
  }
}

const goAgreementPage = () => {
  const suffix = env.env === "local" ? "dev" : env.env === "prod" ? "" : env.env
  location.href = `https://scshare${suffix}.smartcinema.com.cn/register_greement/index.html`
}

// 获取图形验证码
const getVerifyImg = (params) => {
  return axios.get("/web/verifCode", params)
}

// 发送短信验证码
const sendSMSCode = (data) => {
  return axios.post("/web/checkCode", data)
}

// 根据token获取用户信息
const getUserByToken = () => {
  return axios.post("/web/getUserByToken")
}

const getTicketList = (data) => {
  return axios.get("/screenRoom/ticketList", data)
}

// h5授权登录
const getWechat = (url) => {
  location.replace((baseURL || "https://api-test.smartcinema.com.cn") + "/web/getWeChat?url=" + url)
}
const getUserPoints = (data) => {
  return axios.post("/points/user/accountInfo", data)
}
// 获取认证状态
const getAuthStatus = (data) => {
  return axios.get("/ucenter/user/getAuthStatus", data)
}
// 认证
const setAuthStatus = (data) => {
  return axios.post(`/ucenter/user/auth`, data)
}
// code获取
const getuserCode = (data) => {
  let uid = createUuid()
  return axios.get("/personal/user/getInfo", data, env.browser.inApp ? {} : {
    headers: {
      "X-Ca-Nonce": uid
    }
  })
}

export default {
  login,
  wxLogin,
  getVerifyImg,
  sendSMSCode,
  goBack,
  goAgreementPage,
  getUserByToken,
  getTicketList,
  getWechat,
  getUserPoints,
  loginByCode,
  getuserCode,
  getAuthStatus,
  setAuthStatus,
  sendStatisticsLog (data) {
    let _data = utils.cookie.get("ticket") || {}
    return axios.post("/statistics/addData", {
      data: JSON.stringify([{
        type: "h5-dl",
        url: window.location.href,
        event: 2,
        end: "0",
        source: _data.source,
        filmid: _data.film_id,
        skuid: _data.sku_id,
        spuid: _data.spu_id,
        ...data
      }])
    }, {
      timeout: 1000
    }).catch(() => {})
  }
}
