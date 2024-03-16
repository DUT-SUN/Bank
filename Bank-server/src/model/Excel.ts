import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, AllowNull, ForeignKey } from 'sequelize-typescript';
import User  from './User';

@Table
export default class ExcelFiles extends Model {
    
    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id!: number

    @AllowNull(true)
    @Column(DataType.STRING)
    owner!: string

    @AllowNull(true)
    @Column(DataType.STRING)
    excel_name!: string

    @AllowNull(true)
    @Column(DataType.STRING)
    upload_path!: string

    @AllowNull(true)
    @Column(DataType.STRING)
    file_size!: string
}
