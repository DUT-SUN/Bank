

import {AllowNull, AutoIncrement, Model, PrimaryKey}from 'sequelize-typescript'
import { Table,Column,DataType } from 'sequelize-typescript';
// create table if not exists test1.chess
// (
//     id         int          null,
//     avater     varchar(255) null,
//     playerflag tinyint      null
// );
@Table
export default class Chess extends Model {
    
    @PrimaryKey
    @AllowNull(true)
    @AutoIncrement
    @Column( DataType.INTEGER)
    id!:number
    @Column({
        defaultValue:''
    })
    avater!:string
    @Column
    playerflag!:boolean
}
