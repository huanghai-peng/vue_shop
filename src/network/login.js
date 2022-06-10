import { request } from './request'

export function getLogin(data) {
    return request({
        url: 'login',
        methods: 'post',
        params: data
    })
}