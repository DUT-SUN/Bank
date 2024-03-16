
import {AllowNull, AutoIncrement, Model, PrimaryKey}from 'sequelize-typescript'
import { Table,Column,DataType } from 'sequelize-typescript';
@Table
export default class Todo extends Model {
    
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column( DataType.INTEGER)
    uuid!:number
    @Column(DataType.INTEGER)
    id!:number
    @Column({
        defaultValue:''
    })

    name!:string
    @Column({
        defaultValue:''
    })
    des!:string
 @Column
    ddl!:Date
}
