import axios from "@sc/lib-axios"

const createOrder = (data) => {
  return axios.post(`/order/outside/flowAdd`, data)
}
const wxPay = (data) => {
  return axios.post(`/pay/OutPay/appH5Confirm`, data)
}
const payWxWallet = (data) => {
  return axios.post(`/pay/OutPay/outConfirm`, data)
}
// 验证支付结果
const getWxPayNotify = (data) => {
  return axios.get(`/pay/outside/wxpay/notify`, data)
}
const getPaySku = (data) => {
  return axios.get(`/sku/getSkuH`, data)
}
// 直接购买、0元购
const directPay = (data) => {
  return axios.post(`/pay/directPay`, data)
}
// 打赏
const payReward = (data) => {
  return axios.get(`/pay/wxpay/reward/appH5Confirm`, data)
}
// 退费
const payRefund = (data) => {
  return axios.get(`/pay/hdc/refund`, data)
}

// 查询打赏结果
const getRewardNotify = (data) => {
  return axios.get(`/pay/wxpay/reward/notify`, data)
}
const acceptTicket = (data) => {
  return axios.post(`/ticket/accept`, data)
}

const getPackWxPay = (data) => {
  return axios.get(`/pay/wxpay/pack/appH5Confirm`, data)
}

const getPackPayWxWallet = (data) => {
  return axios.get(`/pay/wxpay/pack/outConfirm`, data)
}

const getPackWxPayNotify = (data) => {
  return axios.get(`/pay/wxpay/pack/notify`, data)
}

export default {
  createOrder, wxPay, getWxPayNotify, getPaySku, payWxWallet, directPay, payReward, acceptTicket, payRefund, getRewardNotify, getPackWxPay, getPackWxPayNotify, getPackPayWxWallet
}
