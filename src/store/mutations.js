import {
  RECORD_USERINFO,
  LOGOUT,
  SHARE_CONFIG,
  CHANGE_SLOGAN_VISIBLE,
  RECORD_FILMS_HISTORY,
  RECORD_POINTS,
  RECORD_USERCODE
} from "./mutation-types"
import share from "@sc/lib-share"
import utils from "@/common/scripts/utils"
import router from "../router"
import env from "@sc/lib-env"
import axios from "@sc/lib-axios"
export default {
  // 记录用户信息
  [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    !env.browser.inApp && localStorage.setItem("token", info.uToken || localStorage.getItem("token"))
  },
  // 登出
  [LOGOUT] (state) {
    state.userInfo = {}
    state.login = false
    localStorage.removeItem("token")
    axios.setUserToken("")
  },
  // 分享链接设置
  [SHARE_CONFIG] (state, shareData) {
    if (state.shareInfo.link === shareData.link) return
    state.shareInfo = shareData || state.shareInfo
    share.init(shareData)
  },
  // 修改slogan显示隐藏
  [CHANGE_SLOGAN_VISIBLE] (state) {
    state.sloganVisible = false
  },
  // 保存影片信息
  [RECORD_FILMS_HISTORY] (state, data) {
    state.filmRecord = data
  },
  // 保存积分
  [RECORD_POINTS] (state, data) {
    state.accountInfo = data
  },
  // 保存用户code
  [RECORD_USERCODE] (state, val = null) {
    state.userCode = val
    if ((utils.getQueryString("ucode") && utils.getQueryString("ucode") === val) || !val) {
      return false
    } else {
      let url = `${location.origin}${location.pathname}?ucode=${val}${location.hash}`
      if (router.currentRoute.meta.share) {
        let link = url
        this.commit(SHARE_CONFIG, {
          ...state.shareInfo, link
        })
      } else {
        let link = `${location.origin}${location.pathname}?ucode=${val}${location.hash}`
        this.commit(SHARE_CONFIG, {
          ...state.shareInfo, link
        })
      }
    }
  }
}
