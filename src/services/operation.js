import axios from "@sc/lib-axios"
// 获取活动影片列表
const getActivityFilms = (data) => {
  return axios.get(`/operation/activity/getActivityFilms`, data)
}
// 获取活动基本信息
const getActivityBasic = (data) => {
  return axios.get(`/index/operation/getBasicInfo`, data)
}
// 获取订阅信息
const getSubscribeInfo = (data) => {
  return axios.get(`/operation/activity/getSubscribeInfo`, data)
}
// 订阅上报
const reportSubscribeInfo = ({ filmName, skuId, url }, data = {}) => {
  return axios.post(`/operation/activity/subscribe?filmName=${encodeURIComponent(filmName)}&skuId=${skuId}&url=${encodeURIComponent(url)}`, data)
}

// 周五活动免费票获取
const getFridayFreeTicket = (data) => {
  return axios.get(`/index/v3/getFridayFreeTicket`, data)
}
// 获取短链接
const getShortUrl = (data) => {
  return axios.get(`/common/getShortUrl`, data)
}

// 获取抽奖积分排行
const getNewYearRank = (data) => {
  return axios.get(`/points/record/newYearRank`, data)
}

// 获取抽奖详情
const getLotteryDetail = (data) => {
  return axios.post(`/prizeActivity/detail`, data)
}

// 获取党建专区合集销票信息
const getTicketState = (data) => {
  return axios.get(`/index/operation/getDangJianInfo`, data)
}

// 核销今天之前所有票
const cancelTickets = (data) => {
  return axios.post(`/index/operation/cancelDangJianHistoryTickets`, data)
}
// 获取活动兑换码
const getChangeCodeList = (data) => {
  return axios.get(`/operation/activity/getChangeCodeList`, data)
}
// 获取活动获奖列表
const getPrizeList = (data) => {
  return axios.get(`/index/operation/getPrizeList`, data)
}
export default {
  getActivityFilms,
  getActivityBasic,
  getSubscribeInfo,
  getFridayFreeTicket,
  reportSubscribeInfo,
  getShortUrl,
  getNewYearRank,
  getLotteryDetail,
  getTicketState,
  cancelTickets,
  getChangeCodeList,
  getPrizeList
}
