import {
  RECORD_FILMS_HISTORY,
  RECORD_POINTS,
  RECORD_USERINFO,
  RECORD_USERCODE,
  LOGOUT
} from "./mutation-types"
import utils from "@/common/scripts/utils"
import services from "@/services"
import axios from "@sc/lib-axios"
import env from "@sc/lib-env"
import sensors from "@/plugins/popplayer"
export default {
  async getFilmeRecord ({ commit, state }) {
    const token = localStorage.getItem("token")
    if (token && !state.login) {
      !env.browser.inApp && axios.setUserToken(token)
      let [err, data] = await utils.to(services.user.getUserByToken())
      if (err) return
      sensors.login(data.uid)
      commit(RECORD_USERINFO, data)
    }
    if (state.login) {
      let ticketPromise = utils.to(services.user.getTicketList({ justUsable: 1 }))
      let codePromise = utils.to(services.user.getuserCode({ "X-User-Id": state.userInfo.uid }))
      let pointsPromise = utils.to(services.user.getUserPoints({ "X-User-Id": state.userInfo.uid }))
      let [ticketErr, ticketData] = await ticketPromise
      let [codeErr, codeData] = await codePromise
      let [pointstErr, pointsData] = await pointsPromise
      !ticketErr && commit(RECORD_FILMS_HISTORY, ticketData.list)
      if (!codeErr) {
        commit(RECORD_USERCODE, codeData.code)
      }
      !pointstErr && commit(RECORD_POINTS, pointsData)
    } else {
      commit(RECORD_USERCODE, utils.getQueryString("ucode") || "")
      commit(LOGOUT)
    }
  }
}
