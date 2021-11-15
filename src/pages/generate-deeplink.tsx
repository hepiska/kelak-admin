import React, { useState } from "react"
import { Form, Input, Button, Checkbox, Avatar, message, } from 'antd'
import UserLayout from "@src/components/layout/user-layout"


const GenerateWeblink: React.FC<any> = () => {
  const [link, changeLink] = useState("")
  return (
    <UserLayout name="Generate Deeplink">
      <Input title="deeplink" onChange={({ target }) => changeLink(target.value)} placeholder="deeplink" />
      <a style={{ padding: "16px" }} href={link}>{link}</a>
    </UserLayout>
  )
}

export default GenerateWeblink