import React, { useEffect, useRef } from 'react'                                                       
import * as echarts from 'echarts';                                                                  
import 'zrender/lib/svg/svg';     
import './index.scss'      
import Bar from '@/components/Bar'  
import { Card, Breadcrumb} from 'antd'
import { Link, useLocation } from 'react-router-dom';
import Analysis from '../analysis';

const Home = () => { 
  const chartRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id'); // 获取id查询参数
  console.log(id)
  useEffect(() => {
    if (chartRef.current) {
      var mychart = echarts.init(chartRef.current);
      var option = {
        title: {
          text: '骗保总占比',
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
              {value:12666, name: '正常人员'},
              {value: 3335, name: '骗保人员'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            color: [ '#7F7FFF','#FF7F7F']
          }
        ]
      };
      option && mychart.setOption(option);
    }
  }, []);

  return (
    id?<Analysis id={id}/>:<>
      <Card
        title={
          <Breadcrumb separator=">">                     
            <Breadcrumb.Item>数据分析</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20,width:'1200px',position:'absolute',top:'93px' , height:'614px', left:'305px' }}
      >
        <div ref={chartRef} id='main' style={{position:'absolute',width:'600px',height:'400px',left:'600px',top:'190px',}}/>   
        <div style={{ position:'absolute',left:'100px' ,bottom:'40px'}}>
          {/* 渲染Bar组件 */}
          <Bar
            title='最近分析文件人数'
            xData={['Affairs.csv', 'data.csv', 'Affairs.csv']}
            yData={[5000, 15000, 10000]}
            style={{ width: '500px', height: '400px' }} />
        </div>
      </Card>                                                                                 
    </>                        
  )
}

export default Home;
