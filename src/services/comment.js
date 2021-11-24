import axios from "@sc/lib-axios"
//
const getCommentList = (data) => {
  return axios.get(`/comment/list`, data)
}

const addComment = (data) => {
  return axios.post(`/comment/add`, data)
}

const setLike = (data) => {
  return axios.post(`/comment/like`, data)
}

const setUnlike = (data) => {
  return axios.post(`/comment/unLike`, data)
}

const getJudgesRank = (data) => {
  return axios.get(`/comment/getJudgesRank`, data)
}

const getShareData = (data) => {
  return axios.get(`/comment/getYunyingShareData`, data)
}

const getSummaryTags = (data) => {
  return axios.get(`/comment/summaryTags`, data)
}
export default {
  getCommentList, addComment, setLike, setUnlike, getJudgesRank, getShareData, getSummaryTags
}
