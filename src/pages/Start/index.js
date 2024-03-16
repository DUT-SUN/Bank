import React, { useState, useEffect } from 'react';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Upload, Table, Button } from 'antd';
import * as XLSX from 'xlsx';
import deleteIcon from "@/assets/delete.png";
import deletingIcon from "@/assets/deleting.png";
import { Card, Breadcrumb, Modal, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { getName } from '@/utils/name'
import { useStore } from '@/store/index'
import { LoadingOutlined } from '@ant-design/icons'
const { Dragger } = Upload;

const ExcelUpload = () => {
    const [tableData, setTableData] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [showTable, setShowTable] = useState(false); // 控制表格的显示
    const [fileList, setFileList] = useState([]); // 保存文件列表
    const [showButton, setShowButton] = useState(false); // 控制按钮的显示
    const [isHovered, setIsHovered] = useState(false); // 控制鼠标是否停上去
    const [fileName, setFileName] = useState(''); // 保存文件名
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { ExcelStore } = useStore();
    const [loading, setLoading] = useState(false); //控制加载指示器的显示
    const handleSaveFile = async ()  => {
        setIsModalVisible(false);
        setUploading(true); // 开始加载
        const file = fileList[0];
        if (file) {
            const fileName = file.name;
            const fileSize = file.size;
            console.log(`File Name: ${fileName}`);
            console.log(`File Size: ${fileSize} bytes`);
            console.log("name:", getName());
            ExcelStore.uploadExcel({ excel: file, owner: getName(), excel_name: fileName, file_size: fileSize });
            setUploading(false);
            if(getName()!=null) {
                const data = await ExcelStore.getExcelList(getName());
                let List = data['data'];
                ExcelStore.setExcelList(List);
            }
        } else {
            console.log('No file is uploaded.');
        }
    };
    const handlePreviewOnly = () => {
        setIsModalVisible(false);
    };
    // useEffect(() => {
    //     if (fileList.length > 0) {
    //         handleSaveFile();
    //     }
    // }, [fileList]);  原本是为了解决延时性而存在的，后来影响了modal，自动关闭

    const props = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        beforeUpload: file => {
            if (uploading) {
                message.error('Only one file can be uploaded at a time!');
                return false;
            }
            const fileType = file.type;
            if (fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && fileType !== 'application/vnd.ms-excel' && fileType !== 'text/csv') {
                message.error('You can only upload Excel or CSV files!');
                return false;
            }
            setFileName(file.name);
            setUploading(true);
            setLoading(true); // 在开始加载数据时，设置loading为true
            const reader = new FileReader();
            reader.onload = (e) => {
                let data;
                if (fileType === 'text/csv') {
                    data = e.target.result;
                } else {
                    data = new Uint8Array(e.target.result);
                }
                const workbook = XLSX.read(data, { type: fileType === 'text/csv' ? 'binary' : 'array' });
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                setTableData([]);
                setTableData(jsonData);
                setShowTable(true); // 文件上传成功后，显示表格
                setShowButton(true); // 文件上传成功后，显示按钮
                setUploading(false);
                setLoading(false); // 在数据加载完成后，设置loading为false
            };
            if (fileType === 'text/csv') {
                reader.readAsText(file, 'gbk');
            } else {
                reader.readAsArrayBuffer(file);
            }
            setFileList([file]); // Add this line
            setUploading(false);
            setIsModalVisible(true); // 显示对话框
            return false;
        },

        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(111)
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                console.log(222)
                message.success(`${info.file.name} file uploaded successfully.`);
                setFileList([info.file]); // 在文件上传完成后更新 fileList
                setFileName(info.file.name); // 保存文件名
                console.log(666, info.file.name); // 打印文件名
            } else if (status === 'error') {
                console.log(333)
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
            if (e.dataTransfer.files.length > 0) {
                const droppedFileName = e.dataTransfer.files[0].name;
                setFileName(droppedFileName); // 保存文件名
                console.log('Dropped file name', droppedFileName);
            }
        }
    };
    const columns = tableData[0]?.map((item, index) => ({
        title: item,
        dataIndex: index.toString(),
        key: index.toString(),
        width: 180,
    }));
    const dataSource = tableData.slice(1).map((row, rowIndex) => {
        const rowObj = {};
        row.forEach((cell, cellIndex) => {
            rowObj[cellIndex.toString()] = cell;
        });
        rowObj.key = rowIndex.toString();
        return rowObj;
    });
    const handleRemove = () => {
        setFileList([]);
        setShowTable(false);
        setShowButton(false);
    };
    return (
        <div style={{ position: 'relative', left: '305px', top: '29px', width: '100%' }}>
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>  <UploadOutlined /> 文件上传</Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {showButton && (
                                <Button type="dashed"
                                    style={{ position: 'relative', left: '980px' }}
                                    onClick={() => {
                                        requestAnimationFrame(handleRemove)
                                    }}
                                    onMouseEnter={() => {
                                        requestAnimationFrame(() => setIsHovered(true));
                                    }}
                                    onMouseLeave={() => {
                                        requestAnimationFrame(() => setIsHovered(false));
                                    }}
                                >
                                    <img src={isHovered ? deletingIcon : deleteIcon} alt="Delete" width="20" height="20" style={{ verticalAlign: 'top' }} />
                                    <span>{fileName}</span>
                                </Button>
                            )}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }
                style={{ marginBottom: 20 }}
            >
                <div style={{ height: '512px' }}>
                    {!showTable && (
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">点击或者拖拽文件到区域内</p>
                            <p className="ant-upload-hint">
                                只支持EXCEL（csv格式文件）
                            </p>
                        </Dragger>
                    )}
                    
                    {loading &&  
        <Spin tip="Loading" size="large"
                style={{ 
                position: 'absolute', 
                top: '150px', 
                left: '49.4%', 
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px'
            }}
        >
        <div className="content" />
      </Spin>
    }
    {showTable && 
        <Table 
            rowClassName="my-table-row" 
            columns={columns} 
            dataSource={dataSource} 
            scroll={{ y: 500 }} 
            style={{ maxHeight: '500px', overflow: 'auto' }} 
        />
    }
                </div>
            </Card>
            <Modal
                title="请选择操作"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="preview" onClick={handlePreviewOnly}>仅预览</Button>,
                    <Button key="save" type="primary" onClick={handleSaveFile}>保存文件</Button>
                ]}
                style={{ top: '40%' }}
            >
                保存文件到EXCEL列表(可在后台管理查看)
            </Modal>
        </div>
    );
};

export default ExcelUpload;
