import React from 'react'
import { Layout, Menu } from 'antd'
import { useHistory } from 'react-router-dom'

const { Header, Content, Footer } = Layout

const menus = [
    { id: 'dashboard', label: 'Dashboard', link: '/' },
    { id: 'profile', label: 'Profile', link: '/profile' }
]

const LayoutComponent = (props) => {
    const history = useHistory()

    const pushPathToHistory = (key) => {
        const item = menus.find(item => item.id === key)
        history.push(item.link)
    }

    return (
        <Layout id='main-layout'>
            <Header>
                <div className="logo" />
                <Menu theme='dark' mode='horizontal' style={{ lineHeight: '64px' }} defaultSelectedKeys={menus[0].id} onClick={({key}) => pushPathToHistory(key)}>
                    {menus.map(menu => (
                        <Menu.Item key={menu.id} title={menu.label}>{menu.label}</Menu.Item>
                    ))}
                </Menu>
            </Header>

            <Content style={{ padding: '24px 50px' }}>
                {props.children}
                <Footer style={{ textAlign: 'center' }}>Cota ©2020 Created by Matthew Wang</Footer>
            </Content>
        </Layout>
    )
}

export default LayoutComponent