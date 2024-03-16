import img404 from '@/assets/error.png'
import './index.scss'
import { Link, useNavigate ,useLocation} from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Table, Tag, Space, Card, Breadcrumb, Form, Button, DatePicker, Select, Input ,Row,Col} from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import moment from 'moment';
import { http } from '@/utils'
import { useStore } from '@/store'
import { getName } from "@/utils/name"
import AnalyseIcon from '@/assets/Analyse.png'

const { Search } = Input;
const { Option } = Select
const { RangePicker } = DatePicker
const Excel = () => {
    const { ExcelStore } = useStore();
const [filteredList, setFilteredList] = useState([]);
const location = useLocation();
    useEffect(() => {
        const loadList = async () => {
            const data = await ExcelStore.getExcelList(getName())
            const dataArray = Object.values(data)
            const flatArray = dataArray.flat()
            ExcelStore.setExcelList(flatArray)
            setFilteredList(flatArray);

            // 检查 URL 中是否有 keyword 参数
            const params = new URLSearchParams(location.search);
            const keyword = params.get('keyword');
            if (keyword) {
                // 如果有，调用 onFinish 函数进行过滤
                onFinish({ search: keyword });
            }
        }
        if(getName()!=null){
            loadList()
        }
    }, [])

    const onFinish = (values) => {
        const {keyword, date, search} = values;
        let tempFilteredList = [...ExcelStore.excelList];    

        if (search) {
            tempFilteredList = tempFilteredList.filter(item => {
                if (item.hasOwnProperty('excel_name')) {
                    return item.excel_name.includes(search);
                } else {      
                    return true;
                }
            });
        }
        
        if (date) {
            const [startDate, endDate] = date;
            tempFilteredList = tempFilteredList.filter(item => {
                let itemDate = moment(item.createdAt, 'YYYY/M/D H:mm:ss');
                itemDate = itemDate.startOf('day');
                let start = moment(startDate).startOf('day');
                let end = moment(endDate).startOf('day');
                return itemDate.isBetween(start, end, null, '[]');
            });
        }

        setFilteredList(tempFilteredList);
    };

    // 删除文章
    const delArticle = async (data) => {
        await http.delete(`/ExcelFiles/${data.id}`)
        const updatedList = filteredList.filter(item => item.id !== data.id);
    setFilteredList(updatedList);
    }

    const navigate = useNavigate()
    const goDetail = (data) => {
        navigate(`/list/detail?id=${data.id}`)
    }
    const AnalyseArticle=(data)=>{
        navigate(`/manage/analysis?id=${data.id}`)
    }

    const columns = [
        {
            title: 'ID',
            key: "id",
            render: (text, record, index) => index + 1,
        },
        {
            title: '文件名',
            dataIndex: 'excel_name',
            key: "excel_name"

        },
        {
            title: '上传时间',
            dataIndex: 'createdAt',
            key: 'createdAt',

        },
        {
            title: '文件大小',
            dataIndex: 'file_size',
            key: 'file_size',
            render: (text) => `${text} bytes`
        },
        {
            title: '操作',
            key: 'operation',
            render: data => {
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<EyeOutlined />}
                            onClick={() => goDetail(data)} />
                        <Button
                            type="primary"
                            className='blue'
                            shape="circle"
                            icon={<img src={AnalyseIcon} width="17" height="17"  style={{ marginTop: '-5px' }}  alt="Analyse" />}
                            onClick={() => AnalyseArticle(data)}
                        />
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => delArticle(data)}
                        />
                    </Space>
                )
            },
            fixed: 'right'
        }
    ]

    return (
        <div className="Excel-contianer">
            {/* 筛选区域 */}
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/admin">后台管理</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>内容管理</Breadcrumb.Item>
                    </Breadcrumb>
                }
                style={{ marginBottom: 20 }}
            >
         <Form onFinish={onFinish} initialValues={{ keyword:null,date: null, search: null }}>
    <Form.Item label="检索内容" name="keyword">
        <Select placeholder="请选择人员或文件" style={{ width: 120 }}>
            <Option value="人员">人员</Option>
            <Option value="文件">文件</Option>
        </Select>
    </Form.Item>
    <Form.Item label="日期" name="date">
                <RangePicker locale={locale} />
            </Form.Item>
    <Row gutter={8}>
        <Col span={7}>
        <Form.Item label="检索" name="search">
    <Input placeholder="输入检索关键字" style={{ 'width': '286px' ,'height':"31.6px"}} />
    </Form.Item>
        </Col>
        <Col span={4}>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    筛选
                </Button>
            </Form.Item>
        </Col>
    </Row>

</Form>

            </Card>
            {/* 文章列表区域 */}
            <Card title={`根据筛选条件共查询到 ${filteredList.length} 条结果：`} className="cardContext">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredList}
                    // pagination={
                    //   {
                    //     pageSize: params.per_page,
                    //     total: ExcelStore.excelList.length,
                    //     onChange: pageChange,
                    //     current: params.page
                    //   }
                    // }
                    bordered
                />
            </Card>
        </div>
    )
}

export default observer(Excel)