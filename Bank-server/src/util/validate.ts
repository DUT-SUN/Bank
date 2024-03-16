
import Schema, { Rules, Values } from "async-validator";
import { Context } from "koa";
/**
 * @description: 
 * @param {Context} ctx 上下文
 * @param {Rules} rules 校验规则
 * @param {boolean} flag 是否决定返回完整错误
 * @return {*}
 */
async function validate<T extends Values>(ctx:Context,rules:Rules,flag:boolean = false):Promise<{data:T,error:any|null}>{
const validator=new Schema(rules)
let data:any={}
switch(ctx.method){
case"GET":
break;
case"POST":
data=getFromData(ctx)
// console.log(data)
break
case "DELETE":
    break

}
return await validator.validate(data).then(() => {
return {data: data as T,error:null}
}).catch((err) => {
    if(flag){
        return {
            data:{}as T,
        error:err
        }
    }
    return {
        
        data:{}as T,
      error:err.errors[0].message
    }
})
function getFromData(ctx:Context){
    console.log( ctx.request.body);
    return ctx.request.body
}
}
export default validate