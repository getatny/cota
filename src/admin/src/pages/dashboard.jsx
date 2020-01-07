import React, {useEffect, useState} from 'react'
import LayoutComponent from '../components/layout'
import { PageHeader, Row, Col, Card, Statistic, Icon, List, Typography, Avatar } from "antd"
import http from '../utils/http'
import Config from '../config'
import '../styles/dashboard.less'

const md5 = require('js-md5')

const Dashboard = () => {
    const [ statisticData, setStatisticData ] = useState({})

    useEffect(() => {
        const fetchStatisticData = async () => {
            const data = await http.get(`${Config.server}/rest/admin/dashboard/statistic`)
            setStatisticData(data)
        }

        fetchStatisticData()
    }, [])

    return <LayoutComponent>
        <div id="dashboard-page">
            <PageHeader style={{
                border: '1px solid rgb(235, 237, 240)',
                backgroundColor: '#fff',
                marginBottom: '24px'
            }} title="仪表盘" subTitle="这里将汇总所有你需要第一时间了解的信息" />

            <div className="main-wrapper">
                <Row gutter={16}>
                    <Col xs={24} lg={8}>
                        <Card title='页面'>
                            <Row gutter={16}>
                                <Col xs={24} lg={6}><Statistic title='总页面数' value={10} prefix={<Icon type='file' />} /></Col>
                                <Col xs={0} lg={18}>
                                    <List header={<div>最新页面</div>} dataSource={statisticData.posts} renderItem={post => (
                                            <List.Item>
                                                <Typography.Text ellipsis><a href={post.url}>{post.title}</a></Typography.Text>
                                            </List.Item>
                                        )}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title='评论'>
                            <Row gutter={16}>
                                <Col xs={24} lg={6}>
                                    <Row gutter={8}>
                                        <Col xs={12} lg={24}>
                                            <Statistic title='已审核' value={10} suffix='条' valueStyle={{ color: '#19be6b' }} style={{ marginBottom: '10px' }} />
                                        </Col>
                                        <Col xs={12} lg={24}>
                                            <Statistic title='未审核' value={10} suffix='条' valueStyle={{ color: '#ff9900' }} />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={0} lg={18}>
                                    <List header={<div>最新评论</div>} dataSource={statisticData.comments} renderItem={comment => (
                                        <List.Item>
                                            <Avatar src={`${Config.gravatarMirror}/${md5(comment.email)}`} size='small' shape='square' style={{ marginRight: '5px' }} />
                                            <Typography.Text ellipsis style={{ width: 'calc(100% - 29px)' }}>{comment.comment}</Typography.Text>
                                        </List.Item>
                                    )}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title='账户'>
                            <Row gutter={16}>
                                <Col xs={24} lg={6}>
                                    <Row gutter={8}>
                                        <Col xs={12} lg={24}>
                                            <Statistic title='可信评论者' value={10} suffix='人' prefix={<Icon type='user' />} style={{ marginBottom: '10px' }} />
                                        </Col>
                                        <Col xs={12} lg={24}>
                                            <Statistic title='管理员' value={10} suffix='人' prefix={<Icon type='team' />} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    </LayoutComponent>
}

export default Dashboard