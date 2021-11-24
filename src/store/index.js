import Vue from "vue"
import Vuex from "vuex"
import mutations from "./mutations"
import actions from "./actions"
import getters from "./getters"
Vue.use(Vuex)
const state = {
  userInfo: {},
  userCode: "",
  login: false,
  sloganVisible: true,
  accountInfo: {},
  filmRecord: [],
  shareInfo: {
    title: "移动电影院，我们的电影院",
    desc: "院线电影抢先看",
    link: "",
    img: "https://g.smartcinema.com.cn/images/e945d9a8ed464c0b867a1c446b70a32d-750-750.jpg", // 分享图标
    jsApiList: ["chooseWXPay"]
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
