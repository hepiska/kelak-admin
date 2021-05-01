import { useState, useEffect } from "react"
import { request } from '@src/services/base'
import { message } from 'antd'





export const usecategories = (skip: number, search: string) => {
  const [categories, setcategories] = useState(null) as any
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [refetch, setRefetch] = useState(false)

  const getcategories = async (search: string, skip: number,) => {
    try {
      setLoading(true)
      const searchCompose = `title-regex:${search}`
      const res = await request.get('/categories', { params: { search: searchCompose, skip: skip || 0, sort: 'created_at:desc', limit: 10 } })
      setLoading(false)
      return {
        categories: res.data.data.categories,
        total: res.data.data.total
      }
    } catch (error) {
      setLoading(true)
      message.error(error.message)
    }
  }

  useEffect(() => {
    getcategories(search, skip).then(res => {
      setcategories(res?.categories)
      setTotal(res?.total)
    })

  }, [skip, search, refetch])


  const deleteCatagoriesAction = async (blogkey?: string) => {
    if (!blogkey) return
    setLoading(true)
    await request.delete('/categories/' + blogkey)
    setLoading(false)
    return
  }

  return [{ loading, categories, total, refetch }, { deleteCatagoriesAction, setRefetch }]
}