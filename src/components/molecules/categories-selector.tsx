import React from "react"
import { Card, Select, Button, message } from 'antd'
import { usecategories } from '@src/hooks/categories'

const { Option } = Select

const CategoriesSelector = ({ name, styles, value, onChange }: any) => {
  const [{ categories }] = usecategories(0, "")
  if (!categories) {
    return null
  }
  return (
    <div style={{ margin: "0px 5px" }}>
      {name} : <Select
        value={value}
        onChange={(value) => {
          onChange(value)
        }}
        style={{ margin: "0px 5px", minWidth: "120px", ...styles }}>
        <Option key="all" value=""> All </Option>

        {categories?.map((_ser: any) => (
          <Option key={_ser._id} value={_ser.slug}> {_ser.name}</Option>
        ))}
      </Select>
    </div>

  )
}

export default CategoriesSelector