import _sensors from "@sc/lib-sensors"
import { queryString } from "@sc/lib-web-utils"
const sensors = {
  trackedList: [],
  base: {
  },
  setBase (data) {
    this.base = Object.assign(this.base, data)
  },
  track (event, data, cb = null) {
    _sensors.track(event, Object.assign({}, this.base, data), cb)
  },
  trackOnce (event, data) {
    if (this.trackedList.indexOf(event) < 0) {
      this.trackedList.push(event)
      this.track(event, data)
    }
  },
  login (uid) {
    _sensors.login(uid)
  }
}

const query = queryString.parse(location.search)
const popParams = Object.keys(query).reduce((params, key) => {
  if (key.startsWith("pop_")) {
    params[key] = decodeURIComponent(query[key] || "")
  }
  return params
}, {})
sensors.setBase(popParams)

export default sensors
