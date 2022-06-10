import { request } from './request'

// 获取商品列表数据
export function getGoodsList(params) {
    return request({
        url: 'goods',
        method: 'get',
        params
    })
}

// 根据id查询商品
export function getIdfetchGoods(id) {
    return request({
        url: `goods/${id}`,
        method: 'get'
    })
}

// 编辑提交商品
export function putGoods(id, param) {
    return request({
        url: `goods/${id}`,
        method: 'put',
        data: param
    })
}

// 删除商品
export function removeGoods(id) {
    return request({
        url: `goods/${id}`,
        method: 'delete'
    })
}

// 获取商品分类列表
export function getCategoriesData() {
    return request({
        url: 'categories',
        method: 'get'
    })
}

// 获取参数列表
export function getAttributesList(id, sel) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'get',
        params: {
            sel
        }
    })
}

// 添加商品
export function addGoods(param) {
    return request({
        url: 'goods',
        method: 'post',
        data: param
    })
}