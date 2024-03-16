import {GithubOutlined ,QqOutlined ,MailOutlined}from '@ant-design/icons'
export const SIDEBAR = {
    avatar: require('@/assets/avater.jpg'),
    title: 'SUN',
    header:{
      loginview: require('@/assets/用户登录.jpg')
    },
    homepages: {
      github: {
        link: 'https://github.com/DUT-SUN',
        icon: <GithubOutlined  className='homepage-icon' />
      },
      email: {
        link:'',
        icon: <MailOutlined  className='homepage-icon' />
      }
    },
    SECRET:'13657182310',
    storeIcon:require('@/assets/收藏夹.png'),
    chatIcon:require('@/assets/QQ.png')
    
}
// pageSize
export const ARCHIVES_PAGESIZE = 15 // archives pageSize
export const TAG_PAGESIZE = 15 // tag / category pageSize
export const HOME_PAGESIZE = 10 // home pageSize