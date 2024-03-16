import { Descriptions ,Badge,Divider,Breadcrumb,Card} from 'antd';
import React from 'react';
import './index.scss'
import Img1 from 'src/assets/1.png'
import Img2 from 'src/assets/2.png'
import Img3 from 'src/assets/3.png'
import Img4 from 'src/assets/4.png'
import Img5 from 'src/assets/5.png'
import Img6 from 'src/assets/6.png'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import {Image}from 'antd'
const About = () => {
  const spanStyle = {
    padding: '20px',
    background: '#efefef',
    color: '#000000'
  }
  
  const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    height: '540px'
  }
  const slideImages = [
    {
      url: Img1,
      caption: 'Slide 1'
    },
    {
      url: Img2,
      caption: 'Slide 1'
    },
    {
      url: Img3,
      caption: 'Slide 1'
    },{
      url: Img4,
      caption: 'Slide 1'
    },{
      url: Img5,
      caption: 'Slide 1'
    },{
      url: Img6,
      caption: 'Slide 1'
    },
  ];
  return (
    <div style={{ position: 'relative', left: '305px', top: '29px', width: '100%' }}>
    <Card >

         <Breadcrumb separator=">">
                        <Breadcrumb.Item> 使用教程</Breadcrumb.Item>
                        <Breadcrumb.Item>
                        <div className="slide-container">
        <Slide>
         {slideImages.map((slideImage, index)=> (
            <div key={index} style={{ 
              ...divStyle, 
              backgroundImage: `url(${slideImage.url})`, 
              backgroundSize: 'contain', 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'center', 
              width: '100%', 
              height: '80%' ,
              backgroundPosition: '10%', 
              marginTop: '40px',
            }}>
              <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}>
                {/* <span style={spanStyle}>{slideImage.caption}</span> */}
              </div>
            </div>
          ))} 
        </Slide>
      </div>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    </Card>
                    </div>
  )
}

export default About
