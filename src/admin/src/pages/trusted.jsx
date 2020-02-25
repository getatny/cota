import React, { useEffect, useState } from 'react'
import LayoutComponent from "../components/layout"
import { PageHeader, Row, Col, Card, Avatar, Icon, Input, message } from "antd"
import http from '../utils/http'
import Config from '../config'

const md5 = require('js-md5')

const Trusted = () => {
    const [trustedUsers, setTrustedUsers] = useState([])
    const [userAvatar, setUserAvatar] = useState(`${Config.gravatarMirror}/${md5('')}?d=mm`)

    let inputTimer = null

    useEffect(() => {
        http.get(`${Config.server}/rest/admin/users/1/15`).then(res => {
            setTrustedUsers(res.data)
        })
    }, [])

    const onInputChanged = e => {
        if (inputTimer !== null) {
            clearTimeout(inputTimer)
        }

        const avatar = `${Config.gravatarMirror}/${md5(e.target.value)}?d=mm`
        inputTimer = setTimeout(() => setUserAvatar(avatar), 500)
    }

    const onAddButtonClicked = value => {
        http.post(`${Config.server}/rest/admin/user/${value}`).then(res => {
            message.success('可信用户添加成功！')
            setTrustedUsers(trustedUsers.push(res.data))
        }).catch(err => {
            console.log(err)
            message.error('可信用户添加失败！')
        })
    }

    return (
        <LayoutComponent>
            <div id="profile-page">
                <PageHeader style={{
                    border: '1px solid rgb(235, 237, 240)',
                    backgroundColor: '#fff',
                    marginBottom: '24px'
                }} title="可信用户" subTitle="下列用户的评论无需审核即可直接显示" />

                <div className="main-wrapper">
                    <Row gutter={16}>
                        <Col xs={24} lg={6}>
                            <Card actions={[<Icon type="ellipsis" key="ellipsis" />]}>
                                <Card.Meta avatar={<Avatar src={userAvatar} />} description='输入邮箱后会自动加载头像'
                                           title={<Input.Search enterButton='添加' size='small' allowClear onChange={onInputChanged} onSearch={onAddButtonClicked} />}/>
                            </Card>
                        </Col>
                        {trustedUsers.map(item => (
                            <Col xs={24} lg={6} key={item.id}>
                                <Card actions={[<Icon type="edit" key="edit" />, <Icon type="delete" key="delete" />]}>
                                    <Card.Meta avatar={<Avatar src={`${Config.gravatarMirror}/${md5(item.email)}?d=mm`} />} title={item.email} description={new Date(item.createdAt).toLocaleDateString()} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </LayoutComponent>
    )
}

export default Trusted
