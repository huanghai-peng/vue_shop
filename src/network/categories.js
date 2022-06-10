import { request } from "./request";

// 获取商品分类列表
export function getCategoriesData(param) {
    return request({
        url: 'categories',
        method: 'get',
        params: param
    })
}

// 根据 id 查询分类
export function getIdCate(id) {
    return request({
        url: `categories/${id}`,
        method: 'get',
    })
}

// 编辑提交分类
export function putCategory(id, cat_name) {
    return request({
        url: `categories/${id}`,
        method: 'put',
        data: {
            cat_name
        }
    })
}


// 删除分类
export function removeCategory(id) {
    return request({
        url: `categories/${id}`,
        method: 'delete'
    })
}

// 添加分类
export function addCategory(param) {
    return request({
        url: 'categories',
        method: 'post',
        data: param
    })
}