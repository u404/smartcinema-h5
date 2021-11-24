import Vue from "vue"
import Confirm from "./Confirm.vue"
const VueComponent = Vue.extend(Confirm)
const vm = new VueComponent().$mount()

let init = false

let defaultOptions = {
  confirmText: "确定",
  cancelText: "取消"
}

const showConfirm = function (options) {
  Object.assign(vm, defaultOptions, options, {
    type: "confirm"
  })

  if (!init) {
    document.body.appendChild(vm.$el)
    init = true
  }

  return vm.confirm()
}
const close = function (options) {
  if (init) {
    return vm.close()
  }
  return null
}
export default {
  showConfirm,
  close
}
