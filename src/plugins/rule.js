const defaultRules = {
  "base": (keyCode) => {
    return keyCode === 8 || keyCode === 12 || keyCode === 13
  },
  "number": (keyCode) => {
    return defaultRules["base"](keyCode) || (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)
  },
  "letter": (keyCode) => {
    return defaultRules["base"](keyCode) || (keyCode >= 65 && keyCode <= 90)
  },
  "number&letter": (keyCode) => {
    return defaultRules["number"](keyCode) || defaultRules["letter"](keyCode)
  }
}

// const listeners = []

const install = function (Vue, options) {
  const unbindHandle = function (el, binding) {
    // let i = listeners.findIndex(o => o.el === el)
    // let listener = listeners[i]
    // if (listener) {
    //   el.onkeydown = null
    //   listeners.splice(i, 1)
    // }
  }
  const bindHandle = function (el, binding) {
    // unbindHandle(el, binding)
    // let listener = {
    //   el: el,
    //   value: "",
    //   handle (e) {
    //     console.log(defaultRules[binding.value](e.keyCode))
    //     return defaultRules[binding.value](e.keyCode)
    //   }
    // }
    // el.onkeydown = listener.handle
    // listeners.push(listener)
  }

  Vue.directive("rule", {
    bind: bindHandle,
    // update: bindHandle,
    unbind: unbindHandle
  })
}

export default {
  install
}
