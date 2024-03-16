import { Context } from "koa";
import { Ctx, Delete, JsonController, Post, UseBefore, Get } from "routing-controllers";
import { Service } from "typedi";
import response from "../util/response";
import sequelize from "../db";
import Test from "../model/test"
import { col, fn, json } from "sequelize/types";
import Color from "../model/Color";
const fs = require("fs");
const multer = require("@koa/multer"); //加载@koa/multer模块
const path = require("path");
import { Sequelize } from "sequelize-typescript";
let myfilename = ""; // 返回给前端的文件名

@Service()
@JsonController()
export class TestController {
  @Get("/test")
  async index(@Ctx() ctx: Context) {

    console.log('get');

    return await Test.findAll(
      {
      }
    ).then(result => {
      return JSON.parse(JSON.stringify(result));
    });
  }

  @Get("/randomcolor")
  async color(@Ctx() ctx: Context) {

    for (var i = 0; i < 10; i++) {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      let a = Math.random().toFixed(2);
      let rgba = `${r},${g},${b},${a}`;
      await Color.create({
        color: rgba
      });
    }
    return await Color.findAndCountAll({
      offset: 0, // 查询的起始下标
      limit: 10 // 查询的条数
    }).then(result => {
      return JSON.parse(JSON.stringify(result));
    });
  }
}