import React, { useEffect, useState } from "react"
import { Row, Col, Divider, Button, Modal, Pagination, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { deleteUser } from '@src/methods/user'
import { Table, Tag, Space } from 'antd'
import { request } from '@src/services/base'





const UserPage: React.FC = () => {

  const [users, setusers] = useState([])
  const [page, setPage] = useState(0)
  const [selectedUser, setDeletedUser] = useState(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [skip, setSkip] = useState(0)

  const onpageChange = (val: any) => {

  }

  const columns = [{ title: 'Nama', dataIndex: "name", key: "name" },
  { title: 'Email', dataIndex: "email", key: "email" },
  {
    title: 'Roles', dataIndex: "roles", render: (text: string, record: any) => (
      <div>
        {record.roles.join(", ")}
      </div>
    )
  },
  {
    title: "Tindakan", dataIndex: "action", render: (text: string, record: any) => (
      <div>
        <Button danger onClick={() => { setDeletedUser(record._id) }}>Hapus</Button>
      </div>
    )
  }]

  const populateUsers = async () => {
    try {
      setLoading(true)
      const res = await request.get("/user", { params: { limit: 10, skip: page * 10 } })

      setusers(res.data.data.users)
      setTotal(res.data.data.total)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      message.error({ content: err.message, style: { marginTop: '20vh' } })
    }
  }

  const deleteUser = async () => {
    try {
      await request.delete("/user/" + selectedUser)
      populateUsers()
      setDeletedUser(null)
    } catch (error) {
      setDeletedUser(null)
      message.error({ content: error.message, style: { marginTop: '20vh' } })
    }

  }

  useEffect(() => {

    populateUsers()
  }, [page])


  return (
    <div>
      <Modal
        title="Title"
        visible={!!selectedUser}
        onOk={deleteUser}
        onCancel={() => setDeletedUser(null)}
      >
        <p>are u sure you want to delete this user</p>
      </Modal>
      <Row>
        <Col span={16} />
        <Col span={8} >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button href="/admin/pengguna/baru" type="primary" icon={<PlusOutlined />}> admin baru</Button>
          </div>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={false}
      >
      </Table>
      <Pagination style={{ marginTop: "20px" }} defaultCurrent={1} total={total} onChange={onpageChange} />
    </div>
  )
}


export default UserPage