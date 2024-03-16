import {verify}from '../util/auth'
import{Context,Next}from 'koa'
import logger from '../logger'
// ,'/uploadchess','/putdown','/fupan','/deletechess','/test'
const allowpage = ['/register','/randomcolor','/todo','/search','/login','/ExcelFiles','/excelList','analysis']
function AuthMiddleware(ctx: Context,next: Next){
    let url = ctx.originalUrl
    // allowpage.indexOf(url) > -1
    // allowpage.some((page) => url.startsWith(page)，这样写/search下的所有形式都可以放过
    if (allowpage.some((page) => url.startsWith(page))) {
        logger.info(`'${ctx.request.body.username}'`+'成功注册了账号！')
    }else {  
        const token=ctx.headers['authorization']
        if(token!==undefined&&token!==''){
        const {error} =verify(token);
        
        if(error!=null){
            ctx.body={
                //@ts-ignore
                msg:error,
                code:1
            }
            return 
        }else{
            return next()
        }
        
        }
        ctx.body={ 
            msg:"authorization 不能为空",
            code:4000
        }
        return 
        }

    }

export default AuthMiddleware