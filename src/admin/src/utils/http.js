import axios from 'axios'

axios.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('cota_admin_user'))
    const token = user ? user.token : null
    config.headers.common['Authorization'] = 'Bearer ' + token
    return config;
})

axios.interceptors.response.use(res => {
    const data = res.data
    if (data.success) {
        return data.response
    } else {
        return Promise.reject(data.msg)
    }
}, err => {
    return Promise.reject('请求失败！')
})

export default axios