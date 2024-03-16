/*
 * @Author: SUN
 * @Date: 2022-08-01 18:03:59
 * @LastEditTime: 2024-03-02 09:54:58
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \blog-server\src\util\response.ts
 */

import { Context } from "koa";
//返回的统一处理
/**
 * @description: 
 * @param {Context} ctx
 * @param {*} data 返回数据
 * @param {string} msg 提示信息
 * @param {number} code 状态码
 * @return {*}
 */
function success(ctx: Context, data: any = [], msg: string = 'success', code: number = 0) {

    return ctx.body = {
        code,
        msg,
        data
    }
}
/**
 * @description: 
 * @param {Context} ctx
 * @param {string} msg 错误提示
 * @param {*} data 扩展提示
 * @param {number} code 状态码
 * @return {*}
 */
function error(ctx: Context, msg: string = 'error', data: any = [], code: number = 1) {
    return ctx.body = {
        code,
        msg,
        data
    }
}
export default { success, error }