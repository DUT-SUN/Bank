

import {AllowNull, AutoIncrement, Model, PrimaryKey}from 'sequelize-typescript'
import { Table,Column,DataType } from 'sequelize-typescript';
@Table
export default class Test extends Model {
    
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column( DataType.INTEGER)
    id!:number
    @Column({
        defaultValue:''
    })
    avater!:string
}
