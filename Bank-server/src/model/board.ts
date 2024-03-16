

import {AllowNull, AutoIncrement, Model, PrimaryKey}from 'sequelize-typescript'
import { Table,Column,DataType } from 'sequelize-typescript';
@Table
export default class Board extends Model {
    
    @PrimaryKey
    @Column( DataType.INTEGER)
    id!:number
    @Column( DataType.INTEGER)
    color!:number
    @Column( DataType.INTEGER)
    rowx!:number
    @Column( DataType.INTEGER)
    colx!:number
    
}
