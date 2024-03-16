//modal表单
import React, { useState } from "react";
import { Modal, Button, Form, Input, Upload, message } from "antd";
import { ContactsOutlined, SmileOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import "antd/es/modal/style"; //改变上面那个包model样式
import { encrypt } from "@/utils/aes";
import { useStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import{getName}from '@/utils/name'
import { getToken } from "@/utils";
import {setimgUrl}from '@/utils/img';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
//props接受destory
function Index() {
  const [visible, setVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
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

  // 为Form建立引用
  const form = React.createRef();
  // 在state内存储modal的visible值
  // 点击submit，form校验成功后获取到form表单的值
  const { UploadStore } = useStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const onFinish = (values) => {
    form.current.validateFields().then(async (value) => {
      // const info = value[0];
      // console.log(info);
      // const image = info.response.str || "123";
      // console.log(image);
      // const namex=getName()
    // await UploadStore.getimgUrl({ info });

    // setVisible(false);
    // navigate("/", { replace: true });
      // 只是修改数据库的图片地址
      // 1 上传文件接口  返回图片地址
      // 2 修改用户头像的接口，更改数据库的地址
      setimgUrl.setImg({ imageUrl });
    });
    // 提示用户
    // 跳转首页、

    // navigate("/", { replace: true });
  };

  const handleChange = (info) => {
    console.log(info, 123);
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
      // console.log(info);
      setimgUrl(info.file.response.data.filepath );
      window.location.reload();
    }
  };
  const normFile = (e) => {
    //如果是typescript, 那么参数写成 e: any
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <>
      <a onClick={() => setVisible(true)} alt="">
        上传头像
      </a>

      <Modal
        width="45%"
        wrapClassName={"regster-modal"}
        destroyOnClose={true}
        centered="true"
        title="头像界面"
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
          </Button>,
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
            label="头像"
            name="imgstr"
            getValueFromEvent={normFile}
            valuePropName="fileList"
          >
            <Upload
              name="avater"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="http://localhost:8080/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}
              headers={{"username": getName(),"authorization":`${getToken()}` }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avater" style={{ width: "100%" }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Index;
