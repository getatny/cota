import React, { useEffect } from 'react'
import LayoutComponent from '../components/layout'
import { PageHeader, Tabs, Form, Input, Button, Icon, message } from "antd"
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
                'admin.trustThreshold': res.admin.trustThreshold
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
                        <Form.Item label='White List'>
                            {getFieldDecorator('api.whiteList')(
                                <Input placeholder='Use , to separate' prefix={<Icon type="ordered-list" />} />
                            )}
                        </Form.Item>
                        <Form.Item label='Token Secret'>
                            {getFieldDecorator('api.jwtSecret')(
                                <Input placeholder='A string use to encrypt token' prefix={<Icon type="safety-certificate" />} />
                            )}
                        </Form.Item>
                    </Form>
                </TabPane>
                <TabPane tab='应用' key='application'>
                    <Form>
                        <Form.Item label='Trust Threshold'>
                            {getFieldDecorator('admin.trustThreshold')(
                                <Input placeholder='' prefix={<Icon type="check-circle" />} />
                            )}
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>
        </div>
    </LayoutComponent>
}

export default Form.create({ name: 'configurations' })(Configuration)
