import { request } from './request'

export function getOrdersList(param) {
    return request({
        url: 'orders',
        method: 'get',
        params: param
    })
}