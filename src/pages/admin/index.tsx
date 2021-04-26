import React, { useState, memo } from "react"
import { Layout, Menu, Breadcrumb, Button } from 'antd'
import { RouteComponentProps, Switch, Route, } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import "./admin.css"
import 'react-quill/dist/quill.snow.css'
import { RouteItems } from './routes'
import { LOGOUT } from '@src/modules/auth'
const { Header, Content, Sider } = Layout
const { SubMenu } = Menu


interface AdminPagesProps extends RouteComponentProps {
  test?: boolean
}


const AdminPages: React.FC<AdminPagesProps> = ({ history }) => {
  const [collapsed, setIsCollapsed] = useState(false)
  const pos = history.location.pathname.split('/')
  const dispatch = useDispatch()
  const token = useSelector((state: any) => state?.auth?.token)

  if (!token) {
    history.replace("/login")
  }

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <img src="/logo.png" className="logo" alt="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[pos[2] || "puskesmas"]}>
          {RouteItems.filter(item => !item.hideSidebar).map((item) => {
            return (
              <Menu.Item key={item.key} icon={item.icon} onClick={() => { history.push(item.url) }}>
                {item.name}
              </Menu.Item>
            )
          })}
        </Menu>

      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 20, justifyContent: "space-between", display: "flex" }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setIsCollapsed(!collapsed),
          })}
          <Button type="text" onClick={() => dispatch(LOGOUT())} danger>logout</Button>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Switch>
            {RouteItems.map(item => (<Route {...item} key={item.key} />))}
          </Switch>
        </Content>
      </Layout>

    </Layout>
  )
}

export default memo(AdminPages)