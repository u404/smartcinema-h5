import "@sc/oops-toast/dist/index.css"
import filters from "./filters"
import directives from "./directives"
import validate from "./validate"
import rule from "./rule"
import services from "@/services"
import toast from "@sc/oops-toast"
import windvane from "@sc/lib-windvane"
import callapp from "@sc/lib-callapp"
import sensors from "./popplayer"
import ShareCover from "@/components/ShareCover/createCover"
import Confirm from "../components/Confirm/Confirm"
const install = (Vue, options) => {
  Vue.prototype.$bus = new Vue()
  Vue.prototype.$services = services
  Vue.prototype.$toast = toast
  Vue.prototype.$windvane = windvane
  Vue.prototype.$sensors = sensors
  Vue.prototype.$callapp = callapp
  Vue.prototype.$confirm = Confirm
  Vue.use(filters)
  Vue.use(directives)
  Vue.use(validate)
  Vue.use(rule)
  Vue.use(ShareCover)
}

export default {
  install
}
