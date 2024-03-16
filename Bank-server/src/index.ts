import dotenv from 'dotenv';
dotenv.config()
import db from './db'
import 'reflect-metadata';
import { createKoaServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { Controllers } from './controller';
import {GlobalMiddlewares} from './middleware';
db()
import {Server}from 'http';
import AccessLogMiddleware from './middleware/AccessLogMiddleware'
import AuthMiddleware from './middleware/AuthMiddleware';
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const path = require('path') 

const app = createKoaServer({
    cors: true,
    controllers: Controllers,
    // middlewares: GlobalMiddlewares
})
app.use(serve(path.join(__dirname, './controller/images')))
app.use(serve(path.join(__dirname, './controller/excelList'))) // 新增这行代码
app.use(serve(path.join(__dirname, './controller/code'))) // 新增这行代码

const main = serve(path.join(__dirname))
app.use(bodyParser())
app.use(main)
app.use(AccessLogMiddleware)
.use(AuthMiddleware)
const run=(port:any):Server => {
    console.log(port )
    return app.listen(port)
}
export default run;

// app
// .use(koaBody({
//     // multipart: true,
//     formidable: {
//         maxFileSize:200*1024*1024
//     }
// }))
