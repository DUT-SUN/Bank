import {AllowNull, AutoIncrement, Model, PrimaryKey}from 'sequelize-typescript'
import { Table,Column,DataType } from 'sequelize-typescript';

@Table
export default class UserDetail extends Model {
    
    @PrimaryKey
    @AllowNull(false)
    @AutoIncrement
    @Column( DataType.INTEGER)
    id!:number
    @Column
    username!:string
    @Column
    password!:string
    @Column
    address!:string
    @Column({
        defaultValue:2
    })
    role!:number  
    @Column({
        defaultValue:0
    })
    notice!:number
    @Column({
        defaultValue:true
    })
    disabled!:boolean
}
