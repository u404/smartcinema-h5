import "@/common/style/reset.scss"
import "@sc/vue-ui-h5/lib/themes/theme-default/index.css"
import "@sc/vue-ui-common/lib/themes/theme-default/index.css"
import "@/common/style/ui-reset.scss"

import "@/common/style/common.scss"

import Vue from "vue"

import "@sc/lib-web-utils" // 引入一系列扩展方法

import ui from "@sc/vue-ui-h5"

import commonUI from "@sc/vue-ui-common"

import plugins from "@/plugins"

import store from "./store/index"

import router from "./router"

import App from "./App.vue"

import VueAwesomeSwiper from "vue-awesome-swiper"

import "swiper/css/swiper.css"

import env from "@sc/lib-env"

import sensors from "@/plugins/popplayer"

const hls = require("videojs-contrib-hls")

Vue.use(hls)

Vue.use(VueAwesomeSwiper)

Vue.use(ui)

Vue.use(commonUI)

Vue.use(plugins)

Vue.config.productionTip = false
!env.browser.inApp && store.dispatch("getFilmeRecord")
// 站内分享埋点上报
const shareEventHandle = () => {
  if (router.currentRoute.name === "tues") {
    sensors.track("page_share", {
      activity_id: "2020929",
      activity_name: "周二特价日"
    })
  }
}
new CustomEvent("HYBaseEvent_ShareEvent")
env.browser.inApp && window.addEventListener("HYBaseEvent_ShareEvent", (event) => {
  shareEventHandle(event.data)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
