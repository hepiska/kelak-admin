import React, { useEffect, useState } from "react"
import { Form, Input, Button, Checkbox, Row, Col, message, Divider, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { request } from '@src/services/base'


const { Title } = Typography

const tailLayout = {
  wrapperCol: { offset: 18, span: 6 },
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

const NewUserpage: React.FC<any> = ({ history }) => {
  const [roles, setRoles] = useState([])
  useEffect(() => {
    getRoles()
  }, [])

  const getRoles = async () => {
    const res = await request.get("/user/roles")
    setRoles(res.data.data.userRoles)
  }

  const onFinish = async (values: any) => {
    try {
      const res = await request.post("/user", { ...values })

      history.goBack()
    } catch (error) {
      message.error({ content: error.message, style: { marginTop: '20vh' } })
    }
  }
  console.log(roles)
  return (
    <div>
      <Title>Admin baru</Title>
      <Divider></Divider>
      <Form
        {...layout}
        onFinish={onFinish}
      >
        <Form.Item
          label="Nama"
          name="name"
          rules={[{ required: true, message: 'masukan nama!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'masukan  email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="roles" label="Roles" rules={[{ required: true }]}>
          <Checkbox.Group>
            <Row>
              {roles.map((role: any) => (
                <Col span={8}>
                  <Checkbox value={role.value} style={{ lineHeight: '32px' }}>
                    {role.name}
                  </Checkbox>
                </Col>
              ))}

            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'masukan password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Ulang Password"
          name="confirmPassword"
          rules={[{ required: true, message: 'masukan ulang password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}


export default NewUserpage