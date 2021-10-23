import React, { useEffect, useState, useMemo } from "react"
import { Table, DatePicker, message, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import day from "dayjs"
import moment from "moment"
import { request } from '@src/services/base'

const { RangePicker } = DatePicker;

const defaultRage = [
  moment().startOf("week"),
  moment().endOf("week")
];


const ReportPage: React.FC<any> = () => {

  const [reports, setReports] = useState([])
  const [dateRange, setDateRange] = useState(defaultRage)
  const [loading, setLoading] = useState(false)

  const getReport = async () => {
    try {
      setLoading(true)
      const res = await request.get("/user/report/article", {
        params: {
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString()
        }
      })

      setReports(res.data.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      message.error({ content: err.message, style: { marginTop: '20vh' } })
    }
  }

  useEffect(() => {
    getReport()

  }, [dateRange])



  const columns = useMemo(() => [{ title: 'Nama', dataIndex: "title", key: "title", render: (text: string, record: any) => <span > {record.writer.name}</span > },
  { title: 'total', dataIndex: "images", key: "images", render: (text: string, record: any) => <span>{record.total}</span> },
  ], [])

  return (
    <div>
      <Row align="middle" justify="end" style={{ margin: "16px 0px" }}>
        <Col span={4} >
          Date Range
        </Col>
        <Col span={8} >
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              setDateRange(dates)
            }}
          />
        </Col>
      </Row>

      <Table columns={columns} dataSource={reports}
        loading={loading}
        pagination={false}
      />
    </div>
  )
}

export default ReportPage