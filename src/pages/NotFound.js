import { Result } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen mt-20">
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Link className=" p-2 px-4 border-2 border-blue-300 bg-blue-100 dark:border-blue-900 dark:bg-blue-900/60 font-bold  " to="/posts">Back Home</Link>}
        />
    </div>
  )
}

export default NotFound