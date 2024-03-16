import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts';
import 'zrender/lib/svg/svg';
import './index.scss'
import Bar from '@/components/Bar'
import { Card, Breadcrumb } from 'antd'
import { Link, useLocation } from 'react-router-dom';
import CsvToTable from '../CsvToTable';
//父子组件传递的id
const Analysis = (props) => {

    const id = props.id;


    return (
        <CsvToTable id={id}/>         
    )
}

export default Analysis;
