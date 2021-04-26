import React, { useEffect, useState, useMemo } from "react"
import { Row, Col, Button, Pagination, Image, Modal, message, Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useBlogs } from "@src/hooks/blogs"
import { Table, Tag, Space } from 'antd'
import { useQuery } from '@src/hooks/routers'
import {
  useLocation
} from "react-router-dom"


const AdminBlogs: React.FC<any> = ({ history }) => {
  const [queries] = useQuery()
  const [selectedArticle, setSelectedArticle] = useState("")
  const location = useLocation()
  const skip = Number(queries.get("skip")) || 0
  const [{ loading, blogs, total, refetch }, { deleteBlogAction, setRefetch }] = useBlogs(skip, "")
  const deleteArticle = async () => {
    try {
      if (selectedArticle) {
        deleteBlogAction && await deleteBlogAction(selectedArticle)
      }
      setSelectedArticle("")
      setRefetch && setRefetch(!refetch)
    } catch (error) {
      message.error(error.message)
    }
  }
  const columns = useMemo(() => [{ title: 'Judul', dataIndex: "title", key: "title", render: (text: string, record: any) => <a href={`/admin/blogs/${record._id}`}>{record.title}</a> },
  { title: 'Banners', dataIndex: "images", key: "images", render: (text: string, record: any) => <Image src={record.images[0]} width={75} /> },
  { title: 'Categories', dataIndex: "categories", key: "categories", render: (text: string, record: any) => record.categories.map((cat: any) => cat.name).join(', ') },
  { title: 'Type', dataIndex: "type", key: "type" },
  {
    title: 'Headline', dataIndex: "isHeadline", key: "isHeadline", render: (text: string, record: any) => <Switch disabled checked={record.isHeadline} />
  },
  {
    title: "Tindakan", dataIndex: "action", render: (text: string, record: any) => (
      <div>
        <Button danger type="link" onClick={() => setSelectedArticle(record._id)}>Hapus</Button>
      </div>
    )
  }], [])

  const onpageChange = (page: number, pageSize?: number) => {
    queries.set("skip", String(page - 1))
    history.replace({
      location: location,
      search: queries.toString()
    })
  }

  console.log("selectedArticle", selectedArticle)

  return (
    <div>
      <Modal
        title="Title"
        visible={!!selectedArticle}
        onOk={deleteArticle}
        onCancel={() => setSelectedArticle("")}
      >
        <p>are u sure you want to delete this article</p>
      </Modal>
      <Row>
        <Col span={16} />
        <Col span={8} >
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <Button onClick={() => history.push("/admin/blogs/new")} type="primary" icon={<PlusOutlined />} >Blog baru</Button>
          </div>
        </Col>
      </Row>
      <Table columns={columns} dataSource={blogs}
        loading={loading}
        pagination={false}
      >
      </Table>
      <Pagination
        style={{ marginTop: 15 }}
        defaultCurrent={1}
        current={skip + 1}
        onChange={onpageChange}
        total={total}
      />
    </div>
  )
}

export default AdminBlogs