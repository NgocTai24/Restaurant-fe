'use client'
import { sendRequest } from '@/utils/api';
import { useHasMounted } from '@/utils/customHook';
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification, Steps } from 'antd';
import { useEffect, useState } from 'react';

const ModalReactive = (props: any) => {
  const { isModalOpen, setIsModalOpen, userEmail } = props;
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState("");
  const hasMounted = useHasMounted();
  useEffect(() => {
    if (userEmail) {
      form.setFieldValue("email", userEmail);
    }
  }, [userEmail])
  if (!hasMounted) return <></>

  const onFinishStep0 = async (value: any) => {
    const { email } = value;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
      body: {
        email
      }
    })
    if (res?.data) {
      setUserId(res?.data?._id)
      setCurrent(1)
    } else {
      notification.error({
        message: "Call Api error",
        description: res?.message
      })
    }
  }

  const onFinishStep1 = async (value: any) => {
    const { code } = value;
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
      body: {
        code, _id: userId
      }
    })
    if (res?.data) {
      setCurrent(2)
    } else {
      notification.error({
        message: "Call Api error",
        description: res?.message
      })
    }
  }

  return (
    <Modal
      title="Kích Hoạt Tài Khoản"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      maskClosable={false}
      footer={null}
    >
      <Steps
        current={current}
        items={[
          {
            title: 'Login',
            // status: 'finish',
            icon: <UserOutlined />,
          },
          {
            title: 'Verification',
            // status: 'finish',
            icon: <SolutionOutlined />,
          },
          {
            title: 'Done',
            // status: 'wait',
            icon: <SmileOutlined />,
          },
        ]}
      />
      {current === 0 &&
        <>
          <div style={{ margin: "20px  0" }}>
            <p>Tài khoản của bạn chưa được kích hoạt</p>
          </div>
          <Form
            name="basic"
            onFinish={onFinishStep0}
            autoComplete="off"
            layout='vertical'
            form={form}
          >
            <Form.Item
              label=""
              name="email"
            >
              <Input disabled value={userEmail} />
            </Form.Item>

            <Form.Item
            >
              <Button type="primary" htmlType="submit">
                Resend
              </Button>
            </Form.Item>
          </Form>
        </>
      }
      {current === 1 &&
        <>
          <div style={{ margin: "20px  0" }}>
            <p>Vui lòng nhập mã xác nhận</p>
          </div>
          <Form
            name="basic"
            onFinish={onFinishStep1}
            autoComplete="off"
            layout='vertical'
            form={form}
          >
            <Form.Item
              label="Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: 'Please input your code!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
            >
              <Button type="primary" htmlType="submit">
                Active
              </Button>
            </Form.Item>
          </Form>
        </>
      }
      {current === 2 &&
        <>
          <div style={{ margin: "20px  0" }}>
            <p>Tài khoản của bạn đã được kích hoạt thành công, Vui lòng đăng nhập lại</p>
          </div>
        </>
      }
    </Modal>
  )
}

export default ModalReactive;