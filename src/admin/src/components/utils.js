import axios from 'axios'

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('cota_admin_token');
    config.headers.common['Authorization'] = 'Bearer ' + token;
    return config;
})

axios.interceptors.response.use(res => {
    if (res.success) {
        return res.response;
    } else {
        return Promise.reject(res.msg);
    }
}, err => {
    return Promise.reject('请求失败！');
})

export default axios