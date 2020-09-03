import React, { FC } from 'react'
import { UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

/** TODO: The main layout of the app should be here such as tabs, menu, etc. Move profile icon into the menu. */
const Home: FC = () => (
  <div className="App">
    <Link to={`/profile`}>
        <UserOutlined></UserOutlined>
    </Link>
  </div>
)

export default Home