import React, { FC } from 'react'
import { Layout, Menu } from 'antd'
import './App.css'
import Profile from './components/profile/Profile'

const { Header, Content, Footer } = Layout
const App: FC = () => (
  <div className="App">
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Profile
          name="Bob Smith"
          email="bob3@gatech.edu"
          phoneNumber="123-456-7890"
        />
      </Content>
      <Footer style={{ textAlign: 'center' }}>Cents of Unity Fall 2020</Footer>
    </Layout>
  </div>
)

export default App
