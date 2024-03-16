import axios from 'axios';
import Admin from '../model/Admin';
import User from '../model/User'
import response from '../util/response';
class AdminService{
    getAdminById(adminId:number){
return User.findByPk(adminId)
    }
    getAdminListByPage(page:number=1,limit:number=15){
/**
 * @description: 
 * @offset 偏移量 例如第二页，limit是15的话1*15那么偏移量就是15，那么请求数据的时候就是第二个15条数据
 */
return User.findAndCountAll({
    limit:limit,
    offset:(page-1)*limit
})
    }
    addAdmin(admin:any){
        return User.create(admin)
    }
    getAdminByName(username:string){
        return User.findOne({
            where:{
                username:username
            }
        })
    }
    /**
     * @description: 获取ip地址
     * @param {any} ctx 上下文
     * @return {*}
     */
    getIpInfo = async function (ctx:any) {
        const ip = ctx.ip.split(':').pop()   
        const res = await axios.get('https://apis.map.qq.com/ws/location/v1/ip', {
            params: {
                key: 'MH2BZ-4WTK3-2D63K-YZRHP-HM537-HHBD3',
                // ip //本地测试时ip一直是:::1，所以先注释掉
            }
        })
        if (res.data.status === 0) {
            return  {data:res.data.result} 
            
            
        } else {
            return response.error(ctx,'获取ip地址失败')
        }
    }
}
export default new AdminService();