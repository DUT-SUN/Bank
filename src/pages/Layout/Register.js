//modal表单
import React, { useState } from "react";
import { Modal, Button, Form, Input, Upload, message } from "antd";
import { ContactsOutlined, SmileOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {setName}from '@/utils'
import 'antd/es/modal/style';//改变上面那个包model样式
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
//props接受destory
function Register() {
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  //判断图片大小和格式

  const beforeUpload = (file) => {
    const isJpgPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgPng) {
      message.error("YOU can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB");
    }
    return isJpgPng;
  };
  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  // 为Form建立引用
  const form = React.createRef();
  // 在state内存储modal的visible值
  // 点击submit，form校验成功后获取到form表单的值
  const { loginStore } = useStore();
  const navigate = useNavigate();

  const onFinish = (values) => {
    form.current.validateFields().then(async (value) => {
      const { username, password } = value;
      console.log(username,111)
      setName(username)
      await loginStore.getToken({ username, password });
      
    });
    // 提示用户
    // message.success("注册成功");
    // 跳转首页
    setVisible(false);
    // navigate("/", { replace: true });
  };

  const handleReg = () => {
    // console.log('牛马');
    setVisible(true);
  };
  return (
    <>
      <Button type="primary" onClick={handleReg} alt="" className="btn1">
        LOGIN/REGISTER
      </Button>
      <Modal
        width="45%"
        wrapClassName={"regster-modal"}
        destroyOnClose={true}
        centered="true"
        title="登录注册界面"
        visible={visible}
        onOk={(e) => {
          console.log(e);
          setVisible(false);
        }}
        onCancel={(e) => {
          console.log(e);
          setVisible(false);
        }}
        //删去了form表单自带的submit，在modal的footer自行渲染了一个button，点击后回调onFinish函数
        footer={[
          <Button type="primary" onClick={onFinish} key={"submit"}>
            submit
          </Button>
        ]}
      >
        <Form
          preserve={false}
          validateTrigger={["onBlur", "onChange"]}
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          ref={form}
          className="regfrom"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: "请输入你的用户名" },
              { pattern: /^[^\s']+$/, message: "不能输入特殊字符" },
              { min: 3, message: "用户名至少为3位" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* <Form.Item label="头像" name="avater"></Form.Item>
          <ImgCrop rotate modalTitle='图片裁剪'  >
            <Upload
              className="avater"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </ImgCrop> */}

          <Form.Item
            hasFeedback
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: "密码为必填项",
              },
              {
                len: 6,
                message: "请输入6位密码",
                validateTrigger: "onBlur",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="确认密码"
            name="confirmPassword"
            dependencies={["password"]} //当字段间存在依赖关系时使用。如果一个字段设置了 dependencies 属性。那么它所依赖的字段更新时，该字段将自动触发更新与校验。
            rules={[
              {
                required: true,
                message: "确认你的密码",
              },
              (props) => {
                return {
                  validator(_, value) {
                    // console.log(_);//{field: 'confirmPassword', fullField: 'confirmPassword', type: 'string', validator: ƒ}
                    // 这里面的value就是输入框的值
                    if (!value || props.getFieldValue("password") === value) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error("您输入的两个密码不匹配")
                      );
                    }
                  },
                };
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}></Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Register;
