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
import User from "../model/User";
@Service()
@JsonController()
export class RegisterController {
  @Post("/register")
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
    const admin: any = await AdminService.getAdminByName(data.username);
    const token = sign(data);
    if (admin == null) {
      // const ip = ctx.ip.split(':').pop()
      const address = await AdminService.getIpInfo(ctx);
      // console.log(address);
      const Address = JSON.stringify(address.data);
      //   console.log(Address);
      const row = await User.create({
        username: data.username,
        password: createHash("md5").update(data.password).digest("hex"),
        address: Address,
      });
      return response.success(ctx, { token }, "注册成功");
    } else {
      const password = admin.password || undefined;
      const postpassword = data.password;
      const pwdIsSome =
        createHash("md5").update(postpassword).digest("hex") == password;
      if (admin && pwdIsSome) {
        console.log(data.username)
        const user: any = await User.findOne({ where: { username: data.username } });
        const avater = user ? user.avater : null;
        console.log(avater)
        return response.success(ctx, { token, avater }, "登录成功");
      } else {
        return response.error(ctx, "密码错误");
      }
    }
  }
}

// localhissdsd:8080 + '/shdjad/hdfhkd.png'
