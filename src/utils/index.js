// 先把所有的工具函数导出的模块在这里导入
// 然后再统一导出
import { http } from './http'
import {
  setToken,
  getToken,
  removeToken
} from './token'
import{ 
  getName,
  setName,
  removeName
}from './name'
import { history } from './history'

export {
  http,
  setToken,
  getToken,
  removeToken,
  history,
  getName,
  setName,
  removeName
}

// import {http} from '@/utils'
//给主页
export function isExternal(path) {
  return /^(https?:|mailto:|tel:|http:)/.test(path)
}
// 获取 url query 参数
export const decodeQuery = url => {
  const params = {}
  const paramsStr = url.replace(/\.*\?/, '') // a=1&b=2&c=&d=xxx&e
  paramsStr.split('&').forEach(v => {
    const d = v.split('=')
    if (d[1] && d[0]) params[d[0]] = d[1]
  })
  return params
}