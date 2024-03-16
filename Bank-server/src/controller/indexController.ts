import{Context} from 'koa'
import db from '../db';
import logger from '../logger'
import AdminService  from '../service/AdminService';
class IndexController{
    async index(ctx:Context){
      
        const admin =await AdminService.getAdminById(1);
        ctx.body=admin
    }
}
export default new IndexController