import { Context } from "koa";
import { Ctx, Delete, JsonController, Param, Post, UseBefore, Middleware, KoaMiddlewareInterface, Get } from "routing-controllers";
import { Service } from "typedi";
import ExcelFiles from "../model/Excel";
import response from "../util/response";
const fs = require("fs");
const multer = require("@koa/multer");
import { unlink } from 'fs/promises';
import * as path from 'path';
const spawn = require('child_process').spawn;
const pythonPath = path.join('C:', 'Users', 'lenovo', 'Desktop', 'blog-server', 'src', 'venv', 'Scripts', 'python');
const scriptPath = path.join(__dirname, 'code', 'calculate.py');
const iconv = require('iconv-lite');
const csv = require('csv-parser');

let file_name = "";
declare module 'koa' {
    interface Request {
        files: any;
    }
}
@Middleware({ type: 'before' })
class LogMiddleware implements KoaMiddlewareInterface {
    use(ctx: any, next: (err?: any) => Promise<any>): Promise<any> {
        // console.log(ctx.request.files);
        return next();
    }
}
try {
    fs.readdirSync(__dirname + "/excelList/")
} catch (e) {
    console.error(e)
    fs.mkdir(__dirname + "/excelList/", function (err: any) {
        if (err) {
            console.log(err);
        }
        console.log("Directory created successfully.");
    });
}
var storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, path.join(__dirname, "/excelList/"));
    },
    filename: function (req: any, file: any, cb: any) {
        let type = file.originalname.split(".")[1];
        file_name = `${file.fieldname}-${Date.now().toString(16)}.${type}`;
        console.log('EXCEL上传中...', file_name)
        cb(null, file_name);
    },
});

const limits = {
    fields: 10,
    fileSize: 1024 * 1024 * 10,
    files: 4
};

const upload = multer({ storage, limits });

@Service()
@JsonController('/ExcelFiles')
@UseBefore(upload.fields([{ name: 'excel', maxCount: 1 }, { name: 'owner', maxCount: 1 }, { name: 'excel_name', maxCount: 1 }, { name: 'file_size', maxCount: 1 }]))
export class ExcelFilesController {

    @Get("/analysis/:id")
    async runPythonScript(@Param("id") id: number, @Ctx() ctx: Context) {
        const excel = await ExcelFiles.findAll({ where: { id: id } });
        console.log(id)
        const tmp = excel.map(file => ({
            excel_name: file.getDataValue('excel_name'),
            upload_path: file.getDataValue('upload_path'),
        }));
        const fileName = tmp[0].upload_path.split('/').pop();
        const filePath = path.resolve('C:\Users\lenovo\Desktop\blog-server\src\controller0\excelList', fileName);
        if (fs.existsSync(filePath)) {
            const dataCsvPath = path.join(scriptPath, 'data.csv');
            if (fs.existsSync(dataCsvPath)) {
                fs.unlinkSync(dataCsvPath);
            }
        
            // 读取文件内容
            const content = fs.readFileSync(filePath);
            // 将内容转换为GBK编码
            const contentInGBK = iconv.decode(content, 'GBK');
            // 将转换后的内容写入到新的文件中
            fs.writeFileSync(dataCsvPath, contentInGBK, 'GBK');
        }
        const python = spawn(pythonPath, [scriptPath, 'data.csv']); 
        await new Promise<void>((resolve, reject) => {
            python.on('close', (code: number) => {
                if (code !== 0) {
                    reject(new Error(`Python script exited with code ${code}`));
                } else {
                    resolve();
                }
            });
        });
        return response.success(ctx, { excel_name: tmp[0].excel_name, resCsv: "http://localhost:8080/res.csv" }, "Python script executed successfully", 200);
    }
    
    
    @Get("/")
    async getList(@Ctx() ctx: Context) {
        const user = ctx.request.headers["user"];
        const excelFiles = await ExcelFiles.findAll({ where: { owner: user } });
        const data = excelFiles.map(file => ({
            id: file.getDataValue('id'),
            owner: file.getDataValue('owner'),
            excel_name: file.getDataValue('excel_name'),
            upload_path: file.getDataValue('upload_path'),
            file_size: file.getDataValue('file_size'),
            createdAt: new Date(file.getDataValue('createdAt')).toLocaleString(),
            updatedAt: new Date(file.getDataValue('updatedAt')).toLocaleString(),
            deletedAt: file.getDataValue('deletedAt') ? new Date(file.getDataValue('deletedAt')).toLocaleString() : null
        }));
        return response.success(ctx, { data: data }, "Upload successful", 200);
    }
    @Get("/:id")
    async getExcel(@Param("id") id: number, @Ctx() ctx: Context) {
        console.log()
        const excel = await ExcelFiles.findAll({ where: { id: id } });
        const data = excel.map(file => ({
            id: file.getDataValue('id'),
            owner: file.getDataValue('owner'),
            excel_name: file.getDataValue('excel_name'),
            upload_path: file.getDataValue('upload_path'),
            file_size: file.getDataValue('file_size'),
            createdAt: new Date(file.getDataValue('createdAt')).toLocaleString(),
            updatedAt: new Date(file.getDataValue('updatedAt')).toLocaleString(),
            deletedAt: file.getDataValue('deletedAt') ? new Date(file.getDataValue('deletedAt')).toLocaleString() : null
        }));
        return response.success(ctx, { data: data }, "get successful", 200);
    }
    @Post("/")
    async create(@Ctx() ctx: Context) {
        const { owner, excel_name, file_size } = ctx.request.body;
        // if (!ctx.request.files || !ctx.request.files.excel) {
        //     console.log('No files received');
        //     return response.error(ctx, "No files received", 400);
        // } //暂时不懂为啥报错，但是能跑
        const { excel } = ctx.request.files;
        console.log(excel)
        const upload_path = `http://localhost:8080/${excel[0].filename}`;
        await ExcelFiles.create({
            owner: owner,
            excel_name: excel_name,
            upload_path: upload_path,
            file_size: file_size
        });
        return response.success(ctx, { filepath: upload_path }, "Upload successful", 200);
    }
    @Delete("/:id")
    async delete(@Param("id") id: number, @Ctx() ctx: Context) {
        const file = await ExcelFiles.findOne({ where: { id: id } });
        if (file) {
            const filePath = path.join(__dirname, 'excelList', path.basename(file.upload_path));
            // console.log(filePath)
            // 删除文件
            try {
                await unlink(filePath);
                console.log("成功删除文件" + file.excel_name)
            } catch (err) {
                console.error(`Error deleting file: ${err}`);
            }
            // 删除记录
            await ExcelFiles.destroy({
                where: {
                    id: id
                }
            });
        }
        return response.success(ctx, {}, "Delete successful", 200);
    }

}
