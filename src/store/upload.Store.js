// login module
import { makeAutoObservable, set } from 'mobx'
import { http, setToken, getToken, removeToken ,removeName} from '@/utils'
import { message } from 'antd'
import {getimgUrl,removeimgUrl,setimgUrl}from'@/utils/img'
class UploadStore {
  imgUrl= getimgUrl() || ''
  constructor() {
    // 响应式
    makeAutoObservable(this)
  }
  getimgUrl = async (url) => {
    const res = await http.post('http://localhost:8080/upload', {
      avater
    })
    let mes=res.msg;
message.success(mes)   
setimgUrl(url)
  }
}

export default UploadStore