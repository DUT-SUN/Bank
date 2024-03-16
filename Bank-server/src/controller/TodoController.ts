import { Sequelize } from 'sequelize-typescript';
import validate from ".././util/validate";
import AdminService from "../service/AdminService";
import { Context } from "koa";
import { sign } from "../util/auth";
import axios from "axios";
import response from ".././util/response";
import { Rules } from "async-validator";
import Todo from "../model/Todo"
import { Op } from 'sequelize';
import { sequelize } from '../db';
import {

    Body,
    Ctx,
    Delete,
    Get,
    JsonController,
    Param,
    Post,
    Put,
} from "routing-controllers";
import { Inject, Service } from "typedi";
import { createHash } from "crypto";

@Service()
@JsonController()
export class TodoController {
    //获取列表
    @Get("/todo")
    async get(@Ctx() ctx: Context) {

        console.log('get');

        const data = await Todo.findAll(
            {
            }
        );
        console.log(JSON.parse(JSON.stringify(data)))
        return response.success(ctx, { data: JSON.parse(JSON.stringify(data)) }, "获取成功");
    };
    //查询列表
    @Get("/search")
    async search(@Ctx() ctx: Context) {
        const searchString = ctx.query.q;
        console.log(searchString)
        const todo = await Todo.findAll({
            where: {
                name: {
                    [Op.like]: `%${searchString}%`
                }
            }
        })
        console.log(todo)
        return response.success(ctx, { data: JSON.parse(JSON.stringify(todo)) }, "查询成功");
    }
    //上传列表
    @Post("/todo")
    async index(@Ctx() ctx: Context) {
        const data = ctx.request.body;
        let datax = data.data
        for (let obj of datax) {
            let id = obj['id'];
            let name = obj['name'];
            let des = obj['des'];
            let ddl = obj['ddl'];
            const row = await Todo.create({
                id: id,
                name: name,
                des: des,
                ddl: ddl
            });
        }
        return response.success(ctx, { data: data }, "上传成功");
    }
    //修改列表
    @Put("/todo")
    async put(@Ctx() ctx: Context) {
        const { id, ...data } = ctx.request.body;
        await Todo.update(data, {
            where: {
                id
            }
        });
        return response.success(ctx, { data: data }, "更新成功");
    }
    //删除列表
    @Delete("/todo")

    async delete(@Ctx() ctx: Context) {
        console.log('delete', ctx.request.body);
        let { id } = ctx.request.body;
        await Todo.destroy(
            {
                where: { id: id }
            }
        )
        return response.success(ctx, {}, "删除成功");
    };
}
