/**
 * @description: 
 * @param {any} data 数据
 * @param {number} currentPage 当前页
 * @param {number} total 总页数
 * @param {number} limit 限制
 * @param ceil向上取整
 */
import {Model}from "sequelize-typescript"
function paginate<T extends Model[]>(data:T,currentPage:number=1,total:number=0,limit:number=15){
return {
    data,
    currentPage,
    total,
    totalPage:Math.ceil(total/limit),
    limit
}
}
export default paginate