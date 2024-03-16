/*
 * @Author: SUN
 * @Date: 2022-08-01 12:52:47
 * @LastEditTime: 2022-08-03 23:31:37
 * @LastEditors: your name
 * @Description: 这里的sign和verify分别是返回token和验证token
 * @FilePath: \blog-server\src\util\auth.ts
 * 成略在胸，良计速出。
 */
import  Jwt  ,{JsonWebTokenError, JwtPayload, TokenExpiredError}from "jsonwebtoken";
import config from "../config"
function sign(data:any){
    return Jwt.sign({admin:data},config.jwt.jwt_secret as string,{
        expiresIn: config.jwt.jwt_expire
    })
}
function verify(token:string):{admin:JwtPayload|string|null,error:TokenExpiredError|JsonWebTokenError|null}{
    try{
        var decoded=Jwt.verify(token,config.jwt.jwt_secret as string)
        return {
            admin:decoded,
            error: null
        }
    }catch(err){
        return {
            admin:null,
            error:err as TokenExpiredError|JsonWebTokenError|null
        }
    }
}
export{sign,verify}