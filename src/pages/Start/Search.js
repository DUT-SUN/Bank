import React, { useState } from 'react'
import { Input, Row } from 'antd'
import {  useLocation } from 'react-router-dom'
import useMount from '@/hooks/useMount'
import { SearchOutlined } from '@ant-design/icons'
import {history} from '@/utils/history'
import './index.scss'
function SearchButton(props) {
  const location = useLocation()
  const [keyword, setKeyword] = useState('')
  useMount(() => {
  })
  const handleSubmit = () => {
    if (keyword) history.push(`/admin/excel?keyword=${keyword}`)
  }
  const handleChange = e => {
    setKeyword(e.target.value)
  }

  const handlePressEnter = e => {
    e.target.blur()
  }

  return (
    <div  className='search-box'>
      <SearchOutlined className='search-icon' onClick={e => props.history.push(`/admin/excel?keyword=${keyword}`)} />
      <Input
        type='text'
        value={keyword}
        onChange={handleChange}
        onBlur={handleSubmit}
        onPressEnter={handlePressEnter}
        className='search-input'
        placeholder='搜索'
        style={{ width: 400 }}
      />
    </div>
  )
}

export default SearchButton
