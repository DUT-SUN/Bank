import {
  Layout,
  Divider,
  Menu,
  Alert,
  Avatar,
  Modal,
} from "antd";
import React, { useState, useEffect } from "react";
import "./index.scss";
import screenfull from "screenfull";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { HomeFilled, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { history } from "@/utils/history";
import SearchButton from "@/pages/Start/Search";
import { observer } from "mobx-react-lite";
import {useStore} from "@/store/index"
import {mobx } from 'mobx'
import LoginStore from '@/store/login.Store'
import {
  BarChartOutlined,
  DiffOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons";
import Register from "./Register";
import Href from "@/components/Href";
import { http, setToken, getToken, removeToken } from "@/utils";
import { UserOutlined } from "@ant-design/icons";
import Uploadx from "./Uploadx";
import { getimgUrl } from "@/utils/img";
import { getName } from "@/utils/name";
const { Header, Footer, Sider, Content } = Layout;
const loginstore=new LoginStore();
const {loginOut}=loginstore;
const imgUrl = getimgUrl() || ''
const Start  = () => {
const { ExcelStore } = useStore();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await ExcelStore.getExcelList(getName());
      let List = data['data'];
        ExcelStore.setExcelList(List);
    };
    // 初始化时获取数据
    fetchData();
  }, [ExcelStore.excelList]);

  const isFullscreen = false;
  const toggleFullscreen = () => {
    if (screenfull.enabled) {
      screenfull.toggle().then(() => {
        this.setState({
          isFullscreen: screenfull.isFullscreen,
        });
      });
    }
  };

  return (
    <div className="app-cntainer">
      <Layout>
        <Header>
          <Menu mode="horizontal"  defaultSelectedKeys={["home"]} >
            <Menu.Item
              key="mail"
              onClick={() => history.push("/list")}
              icon={<HomeFilled />}
            >
              首页
            </Menu.Item>
            <Menu.SubMenu
              key="SubMenu"
              title="后台管理"
              icon={<SettingOutlined />}
            >
              <Menu.Item icon={<DiffOutlined />} key="/">
                <Link to="/manage">数据管理</Link>
              </Menu.Item>
              <Menu.Item icon={<BarChartOutlined />} key="/excel">
                <Link to="/manage/analysis">数据分析</Link>
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item
              key="about"
              icon={< QuestionCircleOutlined />}
              onClick={() => history.push("/about")}
            >
              操作指南
            </Menu.Item>
            <Menu.Item key="search">
              <SearchButton />
            </Menu.Item>
            {getToken() ? (
              <Menu.SubMenu
                key="login-register"
                className="header-right"
                icon={
                  <Avatar
                    size={32}
                    icon={getimgUrl() ? <img src={imgUrl} alt="用户头像" style={{ width: "100%" }} /> : <UserOutlined />}
                  />
                }
              >
                <Menu.Item icon={<DiffOutlined />} key="/list1">
                  <Uploadx />
                </Menu.Item>
                <Menu.Item icon={<LogoutOutlined />} key="/list2">
                  <Link to="/list"onClick={() => loginOut()}> 退出登录 </Link>
                </Menu.Item>
              </Menu.SubMenu>
            ) : (
              <Menu.Item key="search-login" className="header">
                <Register />
              </Menu.Item>
            )}
          </Menu>
          <Outlet/>
        </Header>
        <div style={{ height: "30px" }}></div>
        <Layout>
          <Sider height="500px" width="252.8px">
            <aside className="app-sidebar">
              <div style={{ height: "50px" }}></div>
              <img src={getimgUrl()} className="sider-avatar" alt="" />
              <h2 className="title">{getName()}</h2>
              {<Alert message={"警惕骗保，绳之以法"} type="info" />}
              <Divider orientation="center"> EXCEL列表</Divider>
              {Object.entries(ExcelStore.excelList).map(([key, excel]) => (
                <div key={key}>
                    <Link to={`/list/detail?id=${excel.id}`}>{excel.excel_name}</Link>
                </div>
            ))}
            </aside>
          </Sider>
        </Layout>
        <Content>
        </Content>
        <Footer>
        </Footer>
      </Layout>
    </div>
  );
};
export default observer(Start);
