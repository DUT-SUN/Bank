import validate from ".././util/validate";
import AdminService from "../service/AdminService";
import { Context } from "koa";
import { sign } from "../util/auth";
import axios from "axios";
import response from ".././util/response";
import { Rules } from "async-validator";

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
export class LoginController {
  @Post("/login")
  async index(@Ctx() ctx: Context) {
  
    const rules: Rules = {
      username: [
        {
          type: "string",
          required: true,
          message: "用户名不可以为空",
        },
      ],
      password: [
        {
          type: "string",
          required: true,
          message: "密码不能为空",
        },
        {
          type: "string",
          min: 6,
          message: "密码长度不可以小于6位",
        },
      ],
    };
    interface IAdmin {
      username: string;
      password: string;
    }
    const { data, error } = await validate<IAdmin>(ctx, rules);
    if (error != null) {
      return response.error(ctx, error);
    }
    // const token=ctx.headers['authorization']
    // if(token!==null){
    //refresh（token）
    // }
    const token = ctx.headers["authorization"];
    const admin = await AdminService.getAdminByName(data.username);
    if (admin !== null) {
      if (
        createHash("md5").update(data.password).digest("hex") === admin.password
      ) {
        response.success(ctx, { token }, "登录成功！");
      } else {
        response.error(ctx, "密码错误！");
      }
    } else {
      response.error(ctx, "不存在此用户！");
    }
  }
}
