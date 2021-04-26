import { useState, useEffect } from "react"
import { request } from '@src/services/base'
import { message } from 'antd'





export const useBlogs = (skip: number, search: string) => {
  const [blogs, setBlogs] = useState(null) as any
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [refetch, setRefetch] = useState(false)

  const getBlogs = async (search: string, skip: number,) => {
    try {
      setLoading(true)
      const searchCompose = `title-regex:${search}`
      const res = await request.get('/articles', { params: { search: searchCompose, skip: skip || 0, limit: 10 } })
      setLoading(false)
      return {
        articles: res.data.data.articles,
        total: res.data.data.total
      }
    } catch (error) {
      setLoading(true)
      message.error(error.message)
    }
  }

  useEffect(() => {
    getBlogs(search, skip).then(res => {
      setBlogs(res?.articles)
      setTotal(res?.total)
    })

  }, [skip, search, refetch])


  const deleteBlogAction = async (blogkey?: string) => {
    if (!blogkey) return
    setLoading(true)
    await request.delete('/articles/' + blogkey)
    setLoading(false)
    return
  }

  return [{ loading, blogs, total, refetch }, { deleteBlogAction, setRefetch }]
}