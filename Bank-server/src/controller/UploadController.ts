import { Context } from "koa";
import { Ctx, JsonController, Post, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import User from "../model/User";
import AdminService from "../service/AdminService";
import response from "../util/response";
const fs = require("fs");
const multer = require("@koa/multer"); //加载@koa/multer模块
const path = require("path");
const jwt = require("jsonwebtoken");
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
export class UploadController {
  @Post("/upload")
  async index(@Ctx() ctx: Context) {
    console.log('update', ctx.request.body);
    const username = ctx.request.headers["username"];
    console.log(myfilename, 33333);
    await User.update(
      {
        avater: myfilename,
      },
      {
        where: {
          username: username,
        },
      }
    );
    console.log('success')
    return response.success(ctx, { filepath: `http://localhost:8080/${myfilename}` }, "上传成功");
  }
}
