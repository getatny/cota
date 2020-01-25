import React, { useEffect } from 'react'
import LayoutComponent from '../components/layout'
import {PageHeader, Tabs, Form, Input, Button, Icon, message, Col, Row} from "antd"
import http from "../utils/http"
import Config from "../config"

const { TabPane } = Tabs

const Configuration = (props) => {
    const { getFieldDecorator } = props.form

    useEffect(() => {
        http.get(`${Config.server}/rest/admin/settings`).then(({ config: res }) => {
            props.form.setFieldsValue({
                'api.whiteList': res.api.whiteList,
                'api.jwtSecret': res.api.jwtSecret,
                'admin.trustThreshold': res.admin.trustThreshold,
                'email.website': res.email.website,
                'email.host': res.email.host,
                'email.port': res.email.port,
                'email.secure': res.email.secure,
                'email.subject': res.email.subject,
                'email.content': res.email.content,
                'email.auth.user': res.email.auth.user,
                'email.auth.pass': res.email.auth.pass,
            })
        })
    }, [])

    const saveSettings = () => {
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                http.post(`${Config.server}/rest/admin/settings`, { configs: values }).then(({ success }) => {
                    if (success) {
                        message.success('Settings saved')
                    } else {
                        message.success('Save settings failed')
                    }
                }).catch(() => message.success('Save settings failed'))
            }
        })
    }

    return <LayoutComponent>
        <div id="configuration-page">
            <PageHeader style={{
                border: '1px solid rgb(235, 237, 240)',
                backgroundColor: '#fff',
                marginBottom: '24px'
            }} title="设置" subTitle="设置Cota" />
        </div>

        <div className='main-content'>
            <Tabs type='card' tabBarExtraContent={<Button type='primary' size='small' onClick={saveSettings}>保存</Button>}>
                <TabPane tab='服务' key='api'>
                    <Form>
                        <Row gutter={16}>
                            <Col xs={24} lg={8}>
                                <Form.Item label='白名单'>
                                    {getFieldDecorator('api.whiteList')(
                                        <Input placeholder='Use , to separate' prefix={<Icon type="ordered-list" />} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item label='Token Secret'>
                                    {getFieldDecorator('api.jwtSecret')(
                                        <Input placeholder='A string use to encrypt token' prefix={<Icon type="safety-certificate" />} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane tab='应用' key='application'>
                    <Form>
                        <Row gutter={16}>
                            <Col xs={24} lg={8}>
                                <Form.Item label='信任门槛'>
                                    {getFieldDecorator('admin.trustThreshold')(
                                        <Input placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
                <TabPane tab='邮件提醒' key='email'>
                    <Form>
                        <Row gutter={16}>
                            <Col xs={24} lg={8}>
                                <Form.Item label='网站标题'>
                                    {getFieldDecorator('email.website')(
                                        <Input placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item label='SMTP服务器 (host)'>
                                    {getFieldDecorator('email.host')(
                                        <Input placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item label='端口号 (port)'>
                                    {getFieldDecorator('email.port')(
                                        <Input placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item label='安全连接'>
                                    {getFieldDecorator('email.secure')(
                                        <Input placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item label='账户名'>
                                    {getFieldDecorator('email.auth.user')(
                                        <Input placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item label='密码'>
                                    {getFieldDecorator('email.auth.pass')(
                                        <Input.Password placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item label='邮件标题' extra='您可以在文本中使用以下变量: %website%: 网站标题; %nickname%: 收件人昵称; %commentedBy%: 评论人昵称；%comment%: 被评论内容; %originComment%: 原评论内容; %url%: 页面地址'>
                                    {getFieldDecorator('email.subject')(
                                        <Input placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Form.Item label='邮件内容' extra='同上'>
                                    {getFieldDecorator('email.content')(
                                        <Input.TextArea placeholder='' prefix={<Icon type="check-circle" />} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    </LayoutComponent>
}

export default Form.create({ name: 'configurations' })(Configuration)
