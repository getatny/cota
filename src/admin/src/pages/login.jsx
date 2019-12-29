import React, { useState } from 'react';
import { Form, Icon, Input, Checkbox, Button, Divider, message } from 'antd';
import { useDispatch } from "react-redux";
import { login as loginEvent } from '../store/actions'
import { http } from '../components/utils'
import Config from '../config'
import '../styles/login.less'

const Password = Input.Password

const Login = (props) => {
    const dispatch = useDispatch()
    const [ logining, setLogining ] = useState(false)
    const { getFieldDecorator } = props.form

    const env = process.env.NODE_ENV === 'development' ? Config.dev : null

    const login = ({username, password}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await http.post(`${env.server}/rest/login`, { username, password })
                resolve(await result.json())
            } catch (e) {
                console.log(e)
                reject(e)
            }
        })
    }

    // handle the event of submit.
    const handleSubmit = e => {
        e.preventDefault()
        props.form.validateFields((err, values) => {
            if (!err) {
                setLogining(true)
                login(values).then(res => {
                    setLogining(false)
                    if (res.success === true) {
                        if (values.remember) {
                            localStorage.setItem('cobaltUserInfo', JSON.stringify({username: values.username}))
                        } else {
                            sessionStorage.setItem('cobaltUserInfo', JSON.stringify({username: values.username}))
                        }

                        dispatch(loginEvent({ username: values.username }))
                        props.history.push('/')
                    } else {
                        message.error(res.err)
                    }
                }).catch(e => {
                    setLogining(false)
                    message.error('Login error')
                })
            }
        })
    }

    return (
        <div className="login-page">
            <div className="login-form">
                <div className="logo">
                    Cota
                </div>
                <Form className="login-form-input" onSubmit={handleSubmit}>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '用户名不能为空！' }],
                        })(<Input size='large' prefix={<Icon type="user" />} placeholder='请输入用户名' />)}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '密码不能为空！' }],
                        })(<Password size='large' prefix={<Icon type="lock" />} placeholder='请输入密码' />)}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>记住我</Checkbox>)}
                    </Form.Item>
                    <Form.Item>
                        <Button loading={logining} size='large' type="primary" htmlType="submit" className="login-form-button">
                          登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Form.create({ name: 'loginForm' })(Login);