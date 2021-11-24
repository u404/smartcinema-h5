import axios from "@sc/lib-axios"
// 获取首页列表
const getIndexList = (data) => {
  return axios.get("/index/v3/getIndexInfo", data)
}
// 获取影片详情
const getFilmDetail = (data) => {
  return axios.get("/index/v3/getFilmDetail", data)
}
const getActivityFilms = (data) => {
  return axios.get("/operation/activity/getActivityFilms", data)
}
const getTicketsBySkuId = (data) => {
  return axios.post("/ticket/getUserTicketsBySkuId", data)
}
// 获取点播播放信息
const getFilmPlayInfo = (data) => {
  return axios.get("/play/getH5FilmPlayInfo", data)
}
// 五夜场影片详情
const getFridayFilmDetail = (data) => {
  return axios.get("/index/v3/getFridayFilmDetail", data)
}

const filmProgressUpload = (data) => {
  return axios.post("/ticket/playFilmProgressUploadWithOutAuth", data)
}

export default {
  getIndexList,
  getFilmDetail,
  getActivityFilms,
  getTicketsBySkuId,
  getFilmPlayInfo,
  filmProgressUpload,
  getFridayFilmDetail
}
