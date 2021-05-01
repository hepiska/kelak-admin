import React, { useEffect, useState } from "react"
import 'react-quill/dist/quill.snow.css'
import { Divider, Form, message, Upload, Button, Input, Typography, Select, Row, Col, Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import RichText from "@src/components/atoms/rich-text"
import { request } from '@src/services/base'
import { getBase64 } from '@src/utils/helpers'
import {
  useParams
} from "react-router-dom"

const { Title } = Typography

const tailLayout = {
  wrapperCol: { offset: 18, span: 6 },
}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
}

const AdminBlogDetail: React.FC<any> = ({ history, location }) => {
  const [loading, setLoading] = useState(false)
  const [blog, setBlog] = useState(null)
  const [types, setTypes] = useState([])
  const [categories, setCategories] = useState([])

  const { id } = useParams() as any
  const getTypeAndCategory = async () => {
    const typesRes = await request.get("/articles/types")
    const categoryRes = await request.get("/categories")
    setTypes(typesRes.data.data.articleTypes)
    setCategories(categoryRes.data.data.categories)
  }
  const getInitial = async (id: string) => {
    const articleRes = await request.get("/articles/" + id,)
    const article = articleRes.data.data
    article.baners = article.images?.map((_data: any) => {
      const newData: any = {}
      newData.uid = _data
      newData.xhr = _data
      newData.url = _data
      return newData
    }) as any

    article.category = article.categories[0]

    setBlog(article)


  }
  useEffect(() => {
    getTypeAndCategory()
    if (id !== "new") {
      getInitial(id)
    }
  }, [id])

  const onFinish = async (values: any) => {
    values.images = values.baners.map((_data: any) => _data.xhr)
    if (values.title) {
      values.name = values.title.toLowerCase()
    }
    values.categories = [values.category]
    try {
      setLoading(true)
      if (id === "new") {
        await request.post("/articles/", { ...values })

      } else {
        await request.put("/articles/" + id, { ...values })
      }
      setLoading(false)
      // history.goBack()
    } catch (error) {
      setLoading(false)
      message.error({ content: error.message, style: { marginTop: '20vh' } })
    }
  }
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return id === "new" || blog ? (
    <div>
      <Title>Blog {id ? "" : "baru"}</Title>
      <Divider></Divider>
      <Form
        {...layout}
        onFinish={onFinish}
        layout="vertical"
        initialValues={blog || undefined}
      >
        <Form.Item
          label="Judul"
          name="title"
          rules={[{ required: true, message: 'masukan nama!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Headline"
          name="isHeadline"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="Baner"
        >
          <Form.Item name="baners"
            rules={[{ required: true, message: 'masukan baners!' }]}
            valuePropName="fileList"
            getValueFromEvent={normFile} noStyle>
            <Upload
              listType="picture-card"
              customRequest={async ({ file, onError, onSuccess }) => {
                try {
                  const base64 = await getBase64(file)

                  const res = await request.post(`/articles/upload/image`, { file: base64, fileName: file?.name }) as any
                  if (onSuccess)
                    onSuccess({ url: res.data.data.url || '' }, res.data.data.url)
                } catch (err) {
                  if (onError)
                    onError(err)
                }

              }}
            >
              {uploadButton}
            </Upload>
          </Form.Item>
        </Form.Item>

        <Row >
          <Col xs={24} sm={11}>
            <Form.Item
              label="Sumber"
              name="source_name"
              rules={[{ message: 'masukan sumber!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={11}>
            <Form.Item
              label="Tautan Sumber"
              name="source_uri"
              rules={[{ message: 'masukan tautan sumber!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row >
          <Col xs={24} sm={11}>
            <Form.Item
              label="Tautan Podcast"
              name="podcast_uri"
              rules={[{ message: 'masukan sumber!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={11}>
            <Form.Item
              label="Tautan Video"
              name="video_uri"
              rules={[{ message: 'masukan tautan sumber!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row >
          <Col xs={24} sm={11}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'masukan category!' }]}
            >
              <Select>
                {categories.map((cat: any) => <Select.Option value={cat._id}>{cat.name}</Select.Option>
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={11}>
            <Form.Item
              label="Tipe"
              name="type"
              rules={[{ required: true, message: 'masukan tipe!' }]}
            >
              <Select>
                {types.map((type: any) => <Select.Option value={type.value}>{type.name}</Select.Option>
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Kontent"
          name="content"
          rules={[{ required: true, message: 'masukan kontent!' }]}
        >
          <RichText />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" loading={loading} htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  ) : null
}

export default AdminBlogDetail