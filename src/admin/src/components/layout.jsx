import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'

const { Header, Content, Footer } = Layout

const menus = [
    { id: 'dashboard', label: 'Dashboard' }
]

const LayoutComponent = (props) => {
    return (
        <Layout id='main-layout'>
            <Header>
                <div className="logo" />
                <Menu theme='dark' mode='horizontal' style={{ lineHeight: '64px' }} defaultSelectedKeys={menus[0].id}>
                    {menus.map(menu => (
                        <Menu.Item key={menu.id}>{menu.label}</Menu.Item>
                    ))}
                </Menu>
            </Header>

            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Cota</Breadcrumb.Item>
                    <Breadcrumb.Item>current</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{props.children}</div>
                <Footer style={{ textAlign: 'center' }}>Cota ©2020 Created by Matthew Wang</Footer>
            </Content>
        </Layout>
    )
}

export default LayoutComponent