import { makeAutoObservable, reaction } from 'mobx'
import { http } from '@/utils'
import { message } from 'antd'
class ExcelStore {
    excelList = [];
    constructor() {
        makeAutoObservable(this)
    };
    setExcelList = (list) => {
        this.excelList = list;
      }
    uploadExcel = async ({ excel, owner, excel_name, file_size }) => {
        // 创建一个 FormData 对象
        const formData = new FormData();
        // 添加字段到 FormData 对象
        formData.append('excel', excel);
        formData.append('owner', owner);
        formData.append('excel_name', excel_name);
        formData.append('file_size', file_size);
        // 调用上传接口
        const res = await http.post('http://localhost:8080/ExcelFiles', formData);
        // console.log(res.code)
        // 检查响应状态
        if (res.code === 200) {
            message.success('Excel file uploaded successfully');
        } else {
            message.error('Failed to upload Excel file');
        }

    }
    getExcelList = async (username) => {
        const headers = { 'user': username };
        const res = await http.get('http://localhost:8080/ExcelFiles', { headers });
        if (res.code === 200) {
            return res.data; // 返回后端返回的数组
        } else {
            message.error('Failed to get Excel list');
        }
    }
    getExcel = async (id) => {
        const res = await http.get(`http://localhost:8080/ExcelFiles/${id}`);
        if (res.code === 200) {
            return res;
        } else {
            message.error('Failed to get Excel list');
        }
    }
    GetAnalysisRes = async(id) => {
        try {
            const res = await http.get(`http://localhost:8080/ExcelFiles/analysis/${id}`);
            if (res.code === 200) {
                return res;
            } else {
                message.error('Failed to Analysis');
            }
        } catch (error) {
            console.error(error);
            // 这里你可以添加更多的错误处理逻辑
        }
    }
}
export default ExcelStore
