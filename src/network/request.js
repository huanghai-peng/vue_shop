import axios from 'axios'

export function request(config) {
    // 创建axios实例
    const instance = axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 1000,
    });

    // 请求拦截器
    instance.interceptors.request.use(config => {
        // 在请求头中添加Authorization字段提供 `token` 令牌
        config.headers.Authorization = sessionStorage.getItem('token')
        return config
    }, err => {
        console.log(err)
    })

    // 响应拦截器
    instance.interceptors.response.use(res => {
        return res.data
    }, err => {
        console.log(err);
    })

    return instance(config);
}