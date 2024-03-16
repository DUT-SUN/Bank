import {Model}from 'sequelize-typescript'
import { Table,Column } from 'sequelize-typescript';
@Table
export default class Admin extends Model {
@Column
    name!:string
    @Column
    mobile!:string
    @Column
    email!:string
    @Column
    password!:string
}
