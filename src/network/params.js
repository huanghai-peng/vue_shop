import { request } from './request'

// 编辑提交参数
export function putCateAttr(id, attrid, attr_name, attr_sel, attr_vals) {
    return request({
        url: `categories/${id}/attributes/${attrid}`,
        method: 'put',
        data: {
            attr_name,
            attr_sel,
            attr_vals
        }
    })
}

// 根据 ID 查询参数
export function getIdAttr(id, attrId, attr_sel, attr_vals) {
    return request({
        url: `categories/${id}/attributes/${attrId}`,
        mathod: 'get',
        params: {
            attr_sel,
            attr_vals
        }
    })
}

// 删除参数
export function removeAttr(id, attrid) {
    return request({
        url: `categories/${id}/attributes/${attrid}`,
        method: 'delete'
    })
}

// 添加参数
export function addArrt(id, attr_name, attr_sel, attr_vals) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'post',
        data: {
            attr_name,
            attr_sel,
            attr_vals
        }
    })
}