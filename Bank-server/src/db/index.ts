import path from 'path'
import { Sequelize } from "sequelize-typescript";
import config from "../config"
import {dbLogger} from "../logger"
import Admin from '../model/Admin'
import User from '../model/User'
import Chess from '../model/chess'
import Board from '../model/board';
import Test from '../model/test'
import Color from '../model/Color'
import Todo from '../model/Todo'
import Excel from '../model/Excel'
const sequelize=new Sequelize(config.db.db_name as string,config.db.db_user as string,config.db.db_password ,{
host:config.db.db_host,
port:config.db.db_port as unknown as number,
dialect:'mysql',
pool: { //使用连接池连接，默认为true
  max: 50,
  min: 0,
  idle: 30000
},
logging:msg=>dbLogger.info(msg),
models:[path.join(__dirname,'..','model/**/*.js'),path.join(__dirname,'..','model/**/*.ts')],
dialectOptions:{
  charset:'utf8mb4'
},
define:{
  paranoid: true,
  timestamps:true,

}
})
const init =()=>{
 Admin.sync({force:false})
 User.sync({force:false})
 Chess.sync({force:false})
 Board.sync({force:false})
 Test.sync({force:false})
 Color.sync({force:false})
Todo.sync({force:false})
Excel.sync({force:false})
}
const db=async()=>{

    try {
        await sequelize.authenticate();
        init()
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
export { sequelize };
export default db