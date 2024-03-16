// login module
import { makeAutoObservable, set } from 'mobx'
import { http, setToken, getToken, removeToken, removeName ,setName} from '@/utils'
import { message } from 'antd'
import { removeimgUrl,setimgUrl } from '@/utils/img'
class LoginStore {
  token = getToken() || ''
  constructor() {
    // 响应式
    makeAutoObservable(this)
  }
  getToken = async ({ username, password }) => {
    // 调用注册接口
    const res = await http.post('http://localhost:8080/register', {
      username, password
    })
    // 存入token
    // const xhr=new XMLHttpRequest();
    // xhr.setRequestHeader('authorization',`'${res.data.token}'`);
    // console.log(res.msg);

    let mes = res.msg;
    this.token = res.data.token
    setToken(this.token)
    setimgUrl('http://localhost:8080/'+res.data.avater)
    setName(username)
    message.success(mes)
    window.location.reload()
    // 存入ls
  }
  
  // 退出登录
  loginOut = () => {
    this.token = ''
    this.name = ''
    removeToken()
    removeName()
    removeimgUrl()
  }
}

export default LoginStore