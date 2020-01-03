import React, {useEffect} from 'react'
import LayoutComponent from '../components/layout'
import { PageHeader, Row, Col, Card, Statistic } from "antd"
import http from '../utils/http'
import Config from '../config'

const Dashboard = () => {
    useEffect(() => {
        http.get(`${Config.server}/rest/admin/dashboard/statistic`)
    }, [])

    return <LayoutComponent>
        <PageHeader style={{
            border: '1px solid rgb(235, 237, 240)',
            backgroundColor: '#fff',
            marginBottom: '24px'
        }} title="Title" subTitle="This is a subtitle" />

        <div className="main-wrapper">
            <Row gutter={16}>
                <Col span={6}>
                    <Card title='TEST'>
                        <Row gutter={16}>
                            <Col xs={24} lg={8}><Statistic title='Test title' value={10} /></Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={9}>
                    <Card title='TEST2'>
                        <Row gutter={16}>
                            <Col xs={24} lg={8}><Statistic title='Test title' value={10} /><Statistic title='Test title' value={10} /></Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={9}>
                    <Card title='TEST3'>
                        <Row gutter={16}>
                            <Col xs={24} lg={8}><Statistic title='Test title' value={10} /><Statistic title='Test title' value={10} /></Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    </LayoutComponent>
}

export default Dashboard