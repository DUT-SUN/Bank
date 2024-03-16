//modal表单
import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { SIDEBAR } from "@/config";
import { SmileOutlined } from "@ant-design/icons";
import Register from "./Register";
import { useStore } from "@/store";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function Demo() {
  const { loginStore } = useStore();
  // 为Form建立引用
  const form = React.createRef();
  // 在state内存储modal的visible值
  const [visible, setVisible] = useState(false);
  // const  [destory,setDestory]=useState(false);

  // 点击submit，form校验成功后获取到form表单的值
  async function onFinish(values) {
    form.current
      .validateFields()
      .then((value) => console.log("value :", value));
    //  console.log(values)
    //  const{account,password} = values;
    //  console.log(account)
    //  await loginStore.getToken({account,password})
    //  message.success('登录成功')
  }

  return (
    <>
      <img
        src={SIDEBAR.header.loginview}
        onClick={setVisible(true)}
        className="login-avatar"
        alt=""
      />
      {
        <Modal
          wrapClassName={"login-modal"}
          destroyOnClose={true}
          centered="true"
          title="登录界面"
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
          // <Register setDestory={setDestory} />bug会同时消失
          footer={[
            <>
              <Register />
              <Button type="primary" onClick={onFinish} key={"submit"}>
                Submit
              </Button>
            </>,
          ]}
        >
          <Form
            preserve={false}
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            ref={form}
          >
            <Form.Item
              label="账号"
              name="account"
              rules={[{ required: true, message: "请输入你的账号" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入您的密码!" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}></Form.Item>
          </Form>
        </Modal>
      }
    </>
  );
}

export default Demo;
