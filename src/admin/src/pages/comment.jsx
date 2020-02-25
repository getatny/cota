import React, { useEffect, useState } from 'react'
import LayoutComponent from "../components/layout"
import { Avatar, Table, message, PageHeader, Popconfirm, Button, Tag, Tabs } from "antd"
import Config from "../config"
import http from "../utils/http"

const md5 = require('js-md5')
const { TabPane } = Tabs

const Comment = () => {
    const [allCommentsData, setAllCommentData] = useState({ comment: [], page: 1, count: 0 })
    const [passCommentsData, setPassCommentData] = useState({ comment: [], page: 1, count: 0 })
    const [unpassCommentData, setUnpassCommentData] = useState({ comment: [], page: 1, count: 0 })

    useEffect(() => {
        http.get(`${Config.server}/rest/admin/comments/null/1/15/-1`).then(res => {
            if (res.comments.length > 0) {
                setAllCommentData(res)
            }
        })
        http.get(`${Config.server}/rest/admin/comments/null/1/15/0`).then(res => {
            if (res.comments.length > 0) {
                setUnpassCommentData(res)
            }
        })
        http.get(`${Config.server}/rest/admin/comments/null/1/15/1`).then(res => {
            if (res.comments.length > 0) {
                setPassCommentData(res)
            }
        })
    }, [])

    const columns = [
        { title: '', key: 'avatar', width: 40, render: (text, record) => (<Avatar shape='square' src={`${Config.gravatarMirror}/${md5(record.email)}`} />) },
        { title: '昵称', key: 'nickname', width: 160, render: (text, record) => (
            record.website ? <a href={record.website} target='_blank'>{record.nickname}</a> : record.nickname
        ) },
        { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
        { title: '评论内容', dataIndex: 'comment', key: 'comment' },
        { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (text, record) => (record.status ? <Tag color='#87d068'>已审核</Tag> : <Tag color='#ff9900'>未审核</Tag>) },
        { title: '操作', key: 'actions', width: 280, render: (text, record) => {
            return record.status ? [
                <Popconfirm placement='top' title='确定删除？' okText='确定' cancelText='取消' onConfirm={() => deleteComment(record.id)} key='delete'>
                    <Button type='danger' icon='delete' style={{ marginRight: 10 }} />
                </Popconfirm>,
                <Popconfirm placement='top' title='确定加入？' okText='确定' cancelText='取消' onConfirm={() => addToTrusted(record.email)} key='trusted'>
                    <Button icon='safety-certificate'>添加可信用户</Button>
                </Popconfirm>
            ] : [
                <Button type='primary' icon='check' onClick={() => passComment(record.id)} style={{ marginRight: 10 }} key='pass' />,
                <Popconfirm placement='top' title='确定删除？' okText='确定' cancelText='取消' onConfirm={() => deleteComment(record.id)} key='delete'>
                    <Button type='danger' icon='delete' style={{ marginRight: 10 }} />
                </Popconfirm>,
                <Popconfirm placement='top' title='确定加入？' okText='确定' cancelText='取消' onConfirm={() => addToTrusted(record.email)} key='trusted'>
                    <Button icon='safety-certificate'>添加可信用户</Button>
                </Popconfirm>
            ]
        } }
    ]

    const commentRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        }
    }

    const passComment = async (commentId) => {
        try {
            await http.post(`${Config.server}/rest/admin/comment/approve/${commentId}`)
            message.success('评论审核通过！')
            setAllCommentData(allCommentsData.map(item => {
                return item.id === commentId ? { ...item, status: 1 } : item
            }))
        } catch(e) {
            console.log(e)
            message.error('审核评论失败！')
        }
    }

    const deleteComment = async (commentId) => {
        try {
            await http.post(`${Config.server}/rest/admin/comments/delete`, {
                lists: [commentId]
            })
            message.success('评论删除成功！')
            setAllCommentData(allCommentsData.filter())
        } catch (e) {
            console.log(e)
            message.error('删除评论失败！')
        }
    }

    const addToTrusted = async (email) => {
        try {
            await http.post(`${Config.server}/rest/admin/user/${email}`)
            message.success('该用户已被加入可信列表！')
        } catch (e) {
            console.log(e)
            message.error('将该用户加入可信列表失败！')
        }
    }

    const onTableChanged = ({ pageSize = 15, current }, filter) => {
        http.get(`${Config.server}/rest/admin/comments/null/${current}/${pageSize}/${filter}`).then(res => {
            if (res.comments.length > 0) {
                switch (filter) {
                    case -1:
                        setAllCommentData(res)
                        break
                    case 1:
                        setPassCommentData(res)
                        break
                    case 0:
                        setUnpassCommentData(res)
                        break
                }
            }
        })
    }

    return (
        <LayoutComponent>
            <div id="comment-page">
                <PageHeader style={{
                    border: '1px solid rgb(235, 237, 240)',
                    backgroundColor: '#fff',
                    marginBottom: '24px'
                }} title="评论列表" subTitle="评论汇总" />

                <div className="main-content">
                    <Tabs type='card'>
                        <TabPane tab={`全部(${allCommentsData.count})`} key='all'>
                            <Table rowSelection={commentRowSelection} columns={columns} dataSource={allCommentsData.comments} rowKey={record => record.id}
                                   pagination={{ pageSize: 15, total: allCommentsData.count }} onChange={(pagination) => onTableChanged(pagination, -1)} />
                        </TabPane>
                        <TabPane tab={`已审核(${passCommentsData.count})`} key='pass'>
                            <Table rowSelection={commentRowSelection} columns={columns} dataSource={passCommentsData.comments} rowKey={record => record.id}
                                   pagination={{ pageSize: 15, total: passCommentsData.count }}  onChange={(pagination) => onTableChanged(pagination, 1)} />
                        </TabPane>
                        <TabPane tab={`未审核(${unpassCommentData.count})`} key='unpass'>
                            <Table rowSelection={commentRowSelection} columns={columns} dataSource={unpassCommentData.comments} rowKey={record => record.id}
                                   pagination={{ pageSize: 15, total: unpassCommentData.count }}  onChange={(pagination) => onTableChanged(pagination, 0)} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </LayoutComponent>
    )
}

export default Comment
