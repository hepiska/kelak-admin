import React, { FC, ReactElement } from "react"
import {
  UserOutlined,
  AlertOutlined,
  HomeOutlined,
  FileImageOutlined,
  FormOutlined,
  BookOutlined

} from '@ant-design/icons'
import UserPage from "./user"
import NewUserPage from "./new-user"
import BlogsPage from "./blogs"
import DetailBlogPage from "./blog-detail"



interface RouteItem {
  icon?: ReactElement,
  key: string
  name: string
  path: string
  exact?: boolean
  hideSidebar?: boolean
  url: string
  component: FC
}

export const RouteItems: Array<RouteItem> = [
  {
    key: "blogs",
    name: "Blogs",
    url: "/admin/blogs",
    path: "/admin/blogs",
    icon: <FormOutlined />,
    exact: true,
    component: BlogsPage
  },
  {
    key: "pengguna",
    name: "Admin",
    url: "/admin/pengguna",
    path: "/admin/pengguna",
    exact: true,
    icon: <UserOutlined />,
    component: UserPage
  },
  {
    key: "admin-baru",
    name: "Admin Baru",
    hideSidebar: true,
    url: "/admin/pengguna/baru",
    path: "/admin/pengguna/baru",
    exact: true,
    component: NewUserPage
  },
  {
    key: "detail-blog",
    name: "Detail Blog",
    hideSidebar: true,
    url: "/admin/blogs/:id",
    path: "/admin/blogs/:id",
    exact: true,
    component: DetailBlogPage
  },


]