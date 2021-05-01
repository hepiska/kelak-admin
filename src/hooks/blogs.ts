import { useState, useEffect } from "react"
import { request } from '@src/services/base'
import { message } from 'antd'





interface blogsFilterType {
  category?: string | null,
  search?: string,
  isHeadline?: boolean
}


export const useBlogs = (skip: number, { search, category, isHeadline }: blogsFilterType) => {
  const [blogs, setBlogs] = useState(null) as any
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [refetch, setRefetch] = useState(false)

  const getBlogs = async () => {
    try {
      setLoading(true)
      let searchCompose = `title-regex:${search}`
      if (isHeadline) {
        searchCompose += `,isHeadline-eq:true`
      }
      const res = await request.get('/articles', { params: { search: searchCompose, skip: skip || 0, limit: 10, category } })
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
    getBlogs().then(res => {
      setBlogs(res?.articles)
      setTotal(res?.total)
    })

  }, [skip, search, category, refetch, isHeadline, category])


  const deleteBlogAction = async (blogkey?: string) => {
    if (!blogkey) return
    setLoading(true)
    await request.delete('/articles/' + blogkey)
    setLoading(false)
    return
  }

  return [{ loading, blogs, total, refetch }, { deleteBlogAction, setRefetch }]
}