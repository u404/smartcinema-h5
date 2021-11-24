
import ShareCover from "./ShareCover.vue"

import Vue from "vue"

function createCover (Component, props) {
  const vm = new Vue({
    render: h => h(Component, { props })
  }).$mount()

  // 获取真实dom
  document.body.appendChild(vm.$el)

  const comp = vm.$children[0]

  comp.close = function () { // 挂在新方法
    document.body.removeChild(vm.$el) // 删除真实dom
    vm.$destroy() // 销毁vm
  }

  return comp
}

export default {
  install (Vue) {
    Vue.prototype.$shareCover = function (opthions) {
      return createCover(ShareCover, opthions)
    }
  }
}
