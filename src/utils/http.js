// 封装axios
// 实例化  请求拦截器 响应拦截器
import { message } from 'antd'
import axios from 'axios'
import { getToken } from './token'
import { history } from './history'
const http = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 40000
})


// 添加请求拦截器
http.interceptors.request.use((config) => {
  // if not login add token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error) => {
  if (error.response) {
    const { status, data } = error.response
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (status === 401) {
      // 跳回到登录 reactRouter默认状态下 并不支持在组件之外完成路由跳转
      // 需要自己来实现
      message.error((data && data.message) || '登录信息过期或未授权，请重新登录！')
      history.push('/list')
    }
    else {
      message.error(data.message || `连接错误 ${status}!`)
    }
  } else {
    // handle error when error.response is undefined
    message.error('An error occurred while making the request.')
  }
  return Promise.reject(error)
})
export { http }