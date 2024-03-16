import React, { useEffect, useState, useRef } from 'react';
import { ListTable } from "@visactor/react-vtable";
import { Card, Breadcrumb, Divider, Button, Drawer, Spin } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import ExcelStore from '@/store/Execl.store'
import { themes } from '@visactor/vtable';
import * as echarts from 'echarts';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Skeleton';
import './index.scss'
import { CSVLink } from "react-csv";
function CsvToTable(props) {
    const chartRef = useRef(null);
    const [firstColumnData, setFirstColumnData] = useState([]);
    const [headers, setHeaders] = useState([{ label: 'Name', key: 'name' }]); // 设置列名
    const excelStore = new ExcelStore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = props.id == undefined ? searchParams.get('id') : props.id; // 获取id查询参数,上层有传递就用上层的没有就用默认url的
    const [loading, setLoading] = useState(true); //控制加载指示器的显示
    const [option, setOption] = useState(null);
    const [excel_name, setexcel_name] = useState(null);
    const [open, setOpen] = useState(false);
    const [downloadLink, setDownloadLink] = useState('');
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    async function parseCSV(response) {


        let decoder = new TextDecoder('gbk');
        if (props.id != undefined) {
            console.log(666);
            decoder = new TextDecoder('utf-8');
        }
        const blob = await response.blob()
        const arrayBuffer = await blob.arrayBuffer();
        const text = decoder.decode(arrayBuffer);
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {});
        });
        return data;
    }


    async function getExcelDetail(id) {
        setLoading(false);
        //获取指定id的数据库那一行的数据
        const res = await excelStore.getExcel(id)
        const excel_name = setexcel_name(res.data.data[0].excel_name);
        const excelUrl = res.data.data[0].upload_path;
        //用ExcelUrl拿到Excel文件
        const response = await fetch(excelUrl);
        const data = await parseCSV(response);
        return data;
    }

    async function getAnalysisDetail(id) {
        setLoading(true);
        //发送到分析接口
        const res = await excelStore.GetAnalysisRes(id)
        //返回[excelname,resCsv]
        const excel_name = setexcel_name(res.data.excel_name);
        const ResCsv = res.data.resCsv;
        const response = await fetch(ResCsv);
        setDownloadLink(ResCsv); // 保存链接到状态变量
        const data = await parseCSV(response);
        // 选择第一列的数据
        const firstColumn = data.map(row => ({ name: row[Object.keys(row)[0]] }));
        //  console.log(111,firstColumn)
        setFirstColumnData(firstColumn); // 保存第一列的数据到状态变量
        setLoading(false);
        return data;
    }
    function handleDownload() {
        window.open(downloadLink); // 在新窗口中打开链接，从而下载文件
    }
    async function processData(id) {
        if (props.id) {
            return getAnalysisDetail(id)

        } else {
            return getExcelDetail(id)
        }
    }
    useEffect(() => {
        if (chartRef.current) {
            var mychart = echarts.init(chartRef.current);
            var option = {
                title: {
                    text: '骗保占比',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: '占比',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: 12666, name: '正常人员' },
                            { value: 3335, name: '骗保人员' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        color: ['#7F7FFF', '#FF7F7F']
                    }
                ]
            };
            option && mychart.setOption(option);
        }
    });
    useEffect(() => {
        processData(id).then((data) => {
            const columns = [
                { field: 'rowNumber', title: '行号', caption: '行号', width: 'auto' },
                ...Object.keys(data[0]).map(key => ({
                    field: key,
                    title: key,
                    caption: key,
                    width: "auto"
                }))
            ];
            const records = data.map((record, index) => ({ rowNumber: index + 1, ...record }));
            setOption({
                columns: columns,
                records: records,
                widthMode: 'standard',
                theme: themes.ARCO.extends({
                    defaultStyle: {
                        borderLineWidth: 0,
                    },
                    headerStyle: {
                        bgColor: '#a881e1',
                        borderColor: 'white',
                        fontWeight: 'normal',
                        color: 'white'
                    },
                    rowHeaderStyle: {
                        bgColor: '#eae1fa',
                        borderColor: 'white',
                        borderLineWidth: 1,
                        fontWeight: 'normal',
                    },
                    cornerHeaderStyle: {
                        bgColor: '#a881e1',
                        fontWeight: 'normal',
                        color: 'white'
                    },
                    bodyStyle: {
                        borderColor: '#f1e8fe',
                        borderLineWidth: 1,
                        bgColor: (args) => {
                            if ((args.row & 1)) {
                                return '#f8f5fe';
                            }
                            return '#FDFDFD';
                        }
                    }
                })
            });
        });
    }, [id]);

    // useEffect(() => {
    //     console.log(option);
    // }, [option]);
    const excel_name_style = {
        fontFamily: 'Alimama AI Font',
        fontSize: '1em', // 初始字体大小
        background: '-webkit-linear-gradient(0deg, #A881E1, #684360)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'fadeIn 3s ease-in-out, changeFont 0.5s forwards',
    };

    // 添加一个渐入的动画效果和一个改变字体属性的动画效果
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
         0% {opacity: 0;}
          100% {opacity: 1;}
        }
        @keyframes changeFont {
          0% {font-weight: normal; font-size: 1em; font-variant: normal; font-style: normal;}
          100% {font-weight: bold; font-size: 40px; font-variant: small-caps; font-style: italic;}
        }
      `;
    document.head.append(style);


    return (

        <div onWheel={(e) => e.stopPropagation()} style={{ position: 'relative', left: '305px', top: '29px', width: '100%' }}>
            {loading &&
                <Spin tip="Loading" size="large"
                    style={{
                        position: 'absolute',
                        top: '320px',
                        left: '48.3%',
                        transform: 'translate(-50%, -50%)',
                        width: '150px',
                        height: '150px'
                    }}
                >
                    <div className="content" />
                </Spin>
            }
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/admin/excel">数据管理</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>数据详情</Breadcrumb.Item>
                    </Breadcrumb>
                }
                style={{ marginBottom: 20 }}
            >
                <div style={excel_name_style}>{excel_name}
                    <>
                    {!loading && <Button type="primary" onClick={showDrawer} className="btn" style={{ left: '50px' }}>
                            分析结果
                        </Button>}
                        <Drawer title="Data Analysis" onClose={onClose} visible={open}>
                            <div ref={chartRef} id='main' style={{ width: '300px', height: '300px' }} />
                            <Divider>------------------------------------------------</Divider>
                            <div style={{ display: 'flex', 'justify-content': 'center', ' align-items': 'center' }} >
                                <Button type="primary" onClick={showDrawer}>
                                    <CSVLink data={firstColumnData} headers={headers}>导出人员</CSVLink>
                                </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Button type="primary" onClick={handleDownload} >
                                    导出数据
                                </Button>

                            </div>
                        </Drawer>
                    </>
                </div>
                {loading && <>
                    <Typography variant="h1"height={'500px'}width={'1180px'}>{loading ? <Skeleton /> : 'h1' }</Typography>
</>}


                {option && <ListTable option={option} height={'450px'} />}
            </Card>
        </div>
    );
}

export default CsvToTable;
