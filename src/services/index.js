import user from "./user"
import order from "./order"
import home from "./home"
import operation from "./operation"
import axios from "axios"
import comment from "./comment"
import store from "@/store/index"
import router from "@/router"
import env from "@sc/lib-env"
import windvane from "@sc/lib-windvane"
// // http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error) {
      switch (error.code) {
        case 400001001:
          // 返回 401 清除token信息并跳转到登录页面
          store.commit("LOGOUT")
          if (env.browser.inApp) {
            windvane.call("SCHYUIInterface.showLoginPage", {
              refreshWhenLogin: "1"
            })
          }
          if (router.currentRoute.path !== "/" && !env.browser.inApp) {
            router.push({
              name: "login",
              query: { redirect: router.currentRoute.fullPath }
            })
          }
          break
        case 404:
          break
      }
    }
    return Promise.reject(error) // 返回接口返回的错误信息
  }
)

export default {
  user, order, home, operation, comment
}
