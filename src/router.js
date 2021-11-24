import Vue from "vue"
import Router from "vue-router"
import store from "@/store/index"
import utils from "@/common/scripts/utils"
import env from "@sc/lib-env"
Vue.use(Router)

export const routes = [
  {
    path: "/", name: "home", component: () => import(/* webpackChunkName: "home" */ "./pages/Home/Home.vue"), meta: { footer: true, slogan: true, requireAuth: false, share: true, index: 0 }
  },
  {
    title: "用户",
    path: "/user",
    name: "user",
    meta: { footer: true, slogan: true, index: 1 },
    component: () => import(/* webpackChunkName: "user" */ "./pages/User/User.vue"),
    children: [
      { path: "settings", component: () => import(/* webpackChunkName: "user" */ "./pages/User/Settings.vue") }
    ]
  },
  {
    title: "认证",
    path: "/identify",
    name: "identify",
    meta: { footer: false, slogan: false, index: 10 },
    component: () => import(/* webpackChunkName: "user" */ "./pages/User/Identify.vue")
  },
  {
    title: "活动",
    path: "/activity",
    name: "activity",
    component: () => import(/* webpackChunkName: "activity" */ "./pages/Activity/Activity.vue")
  },
  {
    title: "运营活动",
    path: "/operation",
    name: "operation",
    component: () => import(/* webpackChunkName: "operation" */ "./pages/Operation/Operation.vue"),
    children: [
      { path: "tues", name: "tues", component: () => import(/* webpackChunkName: "tues" */ "./pages/Operation/Tues.vue"), meta: { index: 3 } },
      { path: "national", name: "national", component: () => import(/* webpackChunkName: "national" */ "./pages/Operation/National.vue"), meta: { share: true, index: 4 } },
      { path: "special", name: "special", component: () => import(/* webpackChunkName: "special" */ "./pages/Operation/Special.vue"), meta: { index: 5 } },
      { path: "spring", name: "spring", component: () => import(/* webpackChunkName: "spring" */ "./pages/Operation/Spring.vue"), meta: { index: 5 } },
      { path: "party-building", name: "party-building", component: () => import(/* webpackChunkName: "PartyBuilding" */ "./pages/Operation/PartyBuilding.vue"), meta: { index: 5 } },
      { path: "qiyihundred", name: "qiyihundred", component: () => import(/* webpackChunkName: "qiyihundred" */ "./pages/Operation/qiyihundred.vue"), meta: { index: 5, slogan: true } },
      { path: "summer", name: "summer", component: () => import(/* webpackChunkName: "summer" */ "./pages/Operation/Summer.vue"), meta: { index: 5 } },
      { path: "summer-result", name: "summer-result", component: () => import(/* webpackChunkName: "summer-result" */ "./pages/Operation/Summer-result.vue"), meta: { index: 5 } },
      { path: "shiyi", name: "shiyi", component: () => import(/* webpackChunkName: "shiyi" */ "./pages/Operation/Shiyi.vue"), meta: { index: 5 } }
    ]
  },
  {
    title: "移动电影院-五夜点映", path: "/week", name: "week", component: () => import(/* webpackChunkName: "week" */ "./pages/Week/Week.vue"), meta: { index: 4 }
  },
  {
    title: "出票", path: "/tickets", name: "tickets", component: () => import(/* webpackChunkName: "tickets" */ "./pages/Tickets/Tickets.vue"), meta: { index: 11 }
  },
  {
    title: "感动付费", path: "/praise", name: "praise", component: () => import(/* webpackChunkName: "praise" */ "./pages/Praise/Praise.vue"), meta: { index: 5 }
  },
  {
    title: "退费详情", path: "/refundDetail", name: "refundDetail", component: () => import(/* webpackChunkName: "refundDetail" */ "./pages/RefundDetail/RefundDetail.vue"), meta: { index: 5 }
  },
  {
    title: "详情", path: "/detail", name: "detail", component: () => import(/* webpackChunkName: "detail" */ "./pages/Detail/Detail.vue"), meta: { slogan: true, index: 6 }
  },
  {
    title: "影片", path: "/movie", name: "movie", component: () => import(/* webpackChunkName: "movie" */ "./pages/Movie/Movie.vue"), meta: { slogan: true, index: 6 }
  },
  {
    title: "发表评论", path: "/comment", name: "comment", component: () => import(/* webpackChunkName: "comment" */ "./pages/Comment/Comment.vue"), meta: { footer: true }
  },
  {
    title: "联系我们", path: "/contact", name: "contact", component: () => import(/* webpackChunkName: "contact" */ "./pages/Contact/Contact.vue")
  },
  {
    title: "遇见纯粹影迷", path: "/join", name: "join", component: () => import(/* webpackChunkName: "join" */ "./pages/Join/Join.vue"), meta: { index: 6 }
  },
  {
    title: "支付", path: "/pay", name: "pay", component: () => import(/* webpackChunkName: "pay" */ "./pages/Pay/Pay.vue"), meta: { requireAuth: true, index: 10 }
  },
  {
    title: "放映", path: "/play", name: "play", component: () => import(/* webpackChunkName: "play" */ "./pages/Play/Play.vue"), meta: { requireAuth: true, index: 10 }
  },
  {
    title: "登录", path: "/login", name: "login", component: () => import(/* webpackChunkName: "login" */ "./pages/Login/Login.vue"), meta: { slogan: true, index: 7 }
  }
]

const shares = {
  national: {
    title: "9.2分佳片今日上映，速来！院线电影5元看8部",
    desc: "随时随地，一票通兑，畅快观影过长假！",
    link: ``,
    img: "https://g.smartcinema.com.cn/images/c2c6177269e6458c9a8537dfa9c2a4cf-120-120.jpg", // 分享图标
    jsApiList: ["chooseWXPay"]
  },
  home: {
    title: "移动电影院，我们的电影院",
    desc: "院线电影抢先看",
    link: ``,
    img: "https://g.smartcinema.com.cn/images/e945d9a8ed464c0b867a1c446b70a32d-750-750.jpg", // 分享图标
    jsApiList: ["chooseWXPay"]
  }
}

const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.share) {
    let code = store.state.userCode || utils.getQueryString("ucode")
    let data = shares[to.name] || shares.home
    data.link = `${location.origin}${location.pathname}?ucode=${code || ""}${location.hash}`
    ;(store.commit("SHARE_CONFIG", data))
  }

  if (to.meta.requireAuth && !env.browser.inApp) {
    if (store.state.login || localStorage.getItem("token")) {
      next()
    } else {
      router.push({ name: "login", query: { redirect: from.fullPath } })
    }
  } else {
    next()
  }
})
export default router
