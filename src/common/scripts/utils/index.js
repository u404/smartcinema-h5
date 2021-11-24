import "./extend"
// import windvane from "@sc/lib-windvane"
// import env from "@sc/lib-env"
const utils = {
  isShowLogin: false
}
window && (window.utils = utils)
global && (global.utils = utils)

utils.formatUrlProtocol = function (s) {
  if (typeof s === "string") {
    return s.replace(/^http:/, "https:")
  }
  return s
}

utils.getQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2]).split("?")[0]
  }
  return null
}

utils.localStorage = {
  set (key, value) {
    localStorage[key] = JSON.stringify(value || null)
  },
  get (key) {
    return JSON.parse(localStorage[key] || null)
  },
  remove (key) {
    localStorage.removeItem(key)
  }
}

utils.sessionStorage = {
  set (key, value) {
    localStorage[key] = JSON.stringify(value || null)
  },
  get (key) {
    return JSON.parse(localStorage[key] || null)
  }
}
/**
 * cookie 操作方法，需要注意的是，一定不能设置多个path或domain不同而name相同的cookie，否则可能出现无法正确取值和无法销毁的问题
 */
utils.cookie = {
  set (key, value, domain = "", path = "/", expireSeconds = 7200) {
    var val = escape(typeof value === "string" ? value : JSON.stringify(value || null))
    var expireDate = new Date()
    expireDate.setSeconds(expireDate.getSeconds() + expireSeconds)
    var expires = expireDate.toGMTString()
    document.cookie = `${key}=${val};expires=${expires};domain=${domain};path=${path}`
  },
  get (key) {
    let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)")
    let arr = document.cookie.match(reg)
    if (arr) {
      try {
        return JSON.parse(unescape(arr[2]) || null)
      } catch (e) {
        return unescape(arr[2])
      }
    } else {
      return null
    }
  },
  remove (key, domain = "", path = "/") {
    this.set(key, null, domain, path, -1)
  }
}
/**
 * 安全设置cookie，完全避免出现多个不同domain或不同path的同名cookie，而引起的值获取混乱的问题
 */
utils.cookieSafe = {
  set (key, value, domain = "", path = "/", expireSeconds = 7) {
    expireSeconds > 0 && this.remove(key)
    var val = escape(
      JSON.stringify({
        domain,
        path,
        value
      })
    )
    var expireDate = new Date()
    expireDate.setSeconds(expireDate.getSeconds() + expireSeconds)
    var expires = expireDate.toGMTString()
    document.cookie = `${key}=${val};expires=${expires};domain=${domain};path=${path}`
  },
  __get (key) {
    let reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)")
    let arr = document.cookie.match(reg)
    if (arr) {
      try {
        return JSON.parse(unescape(arr[2]) || null)
      } catch (e) {
        return unescape(arr[2])
      }
    } else {
      return null
    }
  },
  get (key) {
    let cookie = this.__get(key)
    if (cookie && typeof cookie === "string") {
      return cookie
    }
    return (cookie && cookie.value) || null
  },
  remove (key) {
    var cookie = this.__get(key)
    if (cookie) {
      this.set(key, null, cookie.domain, cookie.path, -1)
    }
  }
}

/**
 * 将search和hash字符串中的参数转化为字典对象，不传参数时，取location中的search和hash
 */
utils.urlParam = function (search, hash) {
  search = search || window.location.search
  hash = hash || window.location.hash
  var fn = function (str, reg) {
    if (str) {
      var data = {}
      str.replace(reg, function ($0, $1, $2, $3) {
        data[$1] = decodeURI($3)
      })
      return data
    }
  }
  return {
    search: fn(search, /([^?=&]+)(=([^&]*))?/g) || {},
    hash: fn(hash, /([^#=&]+)(=([^&]*))?/g) || {}
  }
}

utils.jsonp = function (url, charset, callbackKeyName = "callback") {
  if (!window) return new Error("禁止非浏览器环境下使用jsonp")

  return new Promise((resolve, reject) => {
    let i = 0
    while (window[`__jsonpCallback${i}__`]) {
      i++
    }
    window[`__jsonpCallback${i}__`] = (data) => {
      console.log(url, data)   // eslint-disable-line
      resolve(data)
      window[`__jsonpCallback${i}__`] = null // 将执行完的callback清理掉
    }
    // 此处url的处理方案不太完善，追加&callback=xxx的位置有可能会在#xxx之后
    url += (/[^#]+\?/.test(url) ? "&" : "?") + callbackKeyName + `=__jsonpCallback${i}__`
    var script = document.createElement("script")
    script.src = url
    charset && (script.charset = charset)
    script.onload = function () {
      this.onload = this.onerror = null
      this.parentNode.removeChild(this)
      // callback && callback.call(this, true)
    }
    script.onerror = function (err) {
      this.onload = this.onerror = null
      this.parentNode.removeChild(this)
      // callback && callback.call(this, false)
      console.log("jsonp", err)   // eslint-disable-line

      reject(new Error("请求出错"))
    }
    document.head.appendChild(script)
  })
}

utils.client = {
  isAndroid: !!navigator.userAgent.match(/android/gi),
  isIos: !!navigator.userAgent.match(/iphone|ipod/gi),
  isIpad: !!navigator.userAgent.match(/ipad/gi),
  isIos9: !!navigator.userAgent.match(/OS 9/gi),
  isYx: !!navigator.userAgent.match(/MailMaster_Android/i),
  isNewsapp: !!navigator.userAgent.match(/newsapp/i),
  isWeixin: /MicroMessenger/gi.test(navigator.userAgent),
  isYixin: /yixin/gi.test(navigator.userAgent),
  isQQ: /qq/gi.test(navigator.userAgent)
}

utils.hasOwnProperty = function (obj, key) {
  return hasOwnProperty.call(obj, key)
}

utils.isVNode = function (node) {
  return (
    node !== null &&
    typeof node === "object" &&
    utils.hasOwnProperty(node, "componentOptions")
  )
}

utils.throttle = function (func, delay) {
  // 节流函数
  var timer = null
  var timerStartTime = null
  delay = delay || 500
  var nextDelay = delay
  var lastDelay = null
  var setTimer = function () {
    if (nextDelay) {
      timerStartTime = new Date()
      timer = setTimeout(setTimer, nextDelay)
      lastDelay = nextDelay
      nextDelay = null
    } else {
      nextDelay = delay
      timer && (timer = clearTimeout(timer))
      timerStartTime = null // 这句无所谓
    }
  }

  return function () {
    if (timer) {
      nextDelay = delay - (timerStartTime - new Date() + lastDelay)
      return
    }
    setTimer()
    func.apply(this, arguments)
  }
}

utils.uuid = function (len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("")
  var uuid = []
  var i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-"
    uuid[14] = "4"

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join("")
}

utils.countdown = function (options) {
  let opts = {
    total: 60000,
    timespan: 1000,
    appear: true,
    timechange: function () {},
    ended: function () {},
    ...options
  }
  let leave = 0
  const once = () => {
    let remain = opts.total - leave
    opts.timechange({ remain, leave, total: opts.total })
    if (remain <= 0) {
      opts.ended({ remain, leave, total: opts.total })
      timer && clearInterval(timer)
      timer = null
    }
  }
  let timer = setInterval(() => {
    leave += opts.timespan
    once()
  }, opts.timespan)
  if (opts.appear) {
    once()
  }
}

utils.to = function (promise, cb) {
  return promise.then(data => {
    return [null, data]
  }).catch(err => {
    // if (err.code === 400001001 && env.browser.inApp && !utils.isShowLogin) {
    //   console.log("调用登录")
    //   utils.isShowLogin = true
    //   try {
    //     windvane.call("SCHYUIInterface.tokenInvalidLoginOut")
    //     windvane.call("SCHYUIInterface.showLoginPage")
    //     windvane.call("WVBaseUI.closeWebView")
    //   } catch (error) {
    //     utils.isShowLogin = false
    //     console.log(error)
    //   }
    // }
    return [err]
  })
}

utils.versionCompare = function (curV, reqV) {
  var arr1 = curV.toString().split(".")
  var arr2 = reqV.toString().split(".")
  var minL = Math.min(arr1.length, arr2.length)
  var pos = 0 // 当前比较位
  var diff = 0 // 当前为位比较是否相等
  var flag = false
  // 逐个比较如果当前位相等则继续比较下一位
  while (pos < minL) {
    diff = parseInt(arr1[pos]) - parseInt(arr2[pos])
    if (diff === 0) {
      pos++
      continue
    } else if (diff > 0) {
      flag = true
      break
    } else {
      flag = false
      break
    }
  }
  return flag
}

export default utils
