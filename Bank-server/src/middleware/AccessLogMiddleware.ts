import {Context,Next}from 'koa'
import {accessLogger} from '../logger'
const requestIp = require('request-ip');
function AccessLogMiddleware(ctx:Context,next:Next){
    let clientIp = requestIp.getClientIp(ctx.request); 
const logStr=`path:${ctx.path}|method:${ctx.method}|ua:${ctx.headers['user-agent']}|Ip:${clientIp}`
    accessLogger.info(logStr)
return next()
}
export default AccessLogMiddleware