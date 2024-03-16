import { Context } from "koa";
import { Ctx, Delete, JsonController, Post, UseBefore, Get } from "routing-controllers";
import { Service } from "typedi";
import Chess from "../model/chess";
import Board from "../model/board";
import AdminService from "../service/AdminService";
import response from "../util/response";
import sequelize from "../db";
import db from '../db';
import { col, fn, json } from "sequelize/types";
const fs = require("fs");
const multer = require("@koa/multer"); //加载@koa/multer模块
const path = require("path");
const jwt = require("jsonwebtoken");
import { Sequelize } from "sequelize-typescript";
let myfilename = ""; // 返回给前端的文件名
// return response.success(ctx, {'success': 'success'}, 'success')
try {
  fs.readdirSync(__dirname + "/images/")
} catch (e) {
  console.error(e)
  fs.mkdir(__dirname + "/images/", function (err: any) {
    if (err) {
      console.log(err);
    }
    console.log("目录创建成功。");
  });
}
var storage = multer.diskStorage({
  //文件保存路径
  destination: function (req: any, file: any, cb: any) {
    cb(null, path.join(__dirname, "/images/"));
  },
  //修改文件名称
  filename: function (req: any, file: any, cb: any) {
    let type = file.originalname.split(".")[1];
    // logo.png -> logo.xxx.png
    myfilename = `${file.fieldname}-${Date.now().toString(16)}.${type}`;
    console.log('Username ......', myfilename)
    cb(null, myfilename);
  },
});
//文件上传限制
const limits = {
  fields: 10, //非文件字段的数量
  fileSize: 200 * 1024, //文件大小 单位 b
  files: 1, //文件数量
};

const upload = multer({ storage, limits });

@Service()
@JsonController()
@UseBefore(upload.single('avater'))
export class QtController {


  @Post("/uploadchess")

  async index(@Ctx() ctx: Context) {
    console.log('update', ctx.request.body);
    let { playerflag } = ctx.request.body;
    console.log(myfilename, 33333);

    await Chess.create(
      {
        playerflag: playerflag,

        avater: `http://localhost:8080/${myfilename}`,
      }
    );
    console.log('success')
    return response.success(ctx, { filepath: `http://localhost:8080/${myfilename}` }, "上传成功");
  };
  @Post("/deletechess")

  async delete(@Ctx() ctx: Context) {

    console.log('delete', ctx.request.body);
    let { id } = ctx.request.body;

    await Chess.destroy(
      {
        where: { id: id }
      }

    );
    await Board.destroy({
      where: { id: id }
    })
    console.log('success')
    return response.success(ctx, {}, "删除成功");
  };
  @Get("/uploadchess")
  async get(@Ctx() ctx: Context) {

    console.log('get');

    return await Chess.findAll(
      {
      }
    );
  };
  @Post("/putdown")
  async post(@Ctx() ctx: Context) {

    let n: any[];
    let { color, rowx, colx } = ctx.request.body;


    await Chess.findAll({
      attributes: [
        [Sequelize.fn('max', Sequelize.col('id')), 'id']
      ]
    }).then(result => {
      // console.log(result.Chess);

      const { id } = JSON.parse(JSON.stringify(result))[0];

      console.log(id);
      Board.create(
        {
          id: id,
          color: color,
          rowx: rowx,
          colx: colx
        }
      );

    })

    return response.success(ctx, {}, "下棋成功");

  };

  @Post("/fupan")
  async getqi(@Ctx() ctx: Context) {
    let { id } = ctx.request.body;
    return await Board.findAll({
      where: { id: id }
    }).then(result => {
      return JSON.parse(JSON.stringify(result));
    })
  };
}
