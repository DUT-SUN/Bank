
import { Rules } from "async-validator";
import { Context } from "koa";
import { createHash } from "crypto";
import { Ctx, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { URLSearchParams } from 'url';
import AdminService from "../service/AdminService";
import paginate from "../util/paginate";
import response from "../util/response";
import validate from "../util/validate";
@Service()
@JsonController()
export class AdminController {
    @Post('/list')
    async getAdminList(ctx: Context) {
        /**
         * @description: 
         * @params URLSearchParams 拿到url参数
         */
        const usp = new URLSearchParams(ctx.querystring)
        console.log(usp.get('page'), usp.get('limit'));
        let page = 1, limit = 15
        if (usp.get('page') !== null && isNaN(Number(usp.get('page')))) {
            page = Number(usp.get('page'))
        }
        if (usp.get('limit') && isNaN(Number(usp.get('limit'))) !== null) {
            limit = Number(usp.get('limit'))
        }
        const { rows, count } = await AdminService.getAdminListByPage(page, limit);
        response.success(ctx, paginate(rows, page, count, limit))
    }
    @Post('/login')
    async addAdmin(@Ctx() ctx: Context) {
        const rules: Rules = {
            name: [
                {
                    type: 'string',
                    required: true,
                    message: '用户名不可以为空'
                }],
            password: [
                {
                    type: 'string',
                    required: true,
                    message: '密码不能为空'
                }, {
                    type: 'string',
                    min: 6,
                    message: '密码长度不可以小于6位'
                }
            ]
        }
        interface IAdmin {
            id: number
            name: string
            password: string
        }
        const { data, error } = await validate(ctx, rules)
        console.log(data);
        if (error !== null) {
            return response.error(ctx, error)
        }
        data.password = createHash('md5').update(data.password).digest('hex')
        const row = await AdminService.addAdmin(data)
        if (row.id > 0) {
            return response.success(ctx)
        }
        return response.error(ctx, '插入失败')
    }
}



