import { request, requset } from './request'

// 获取用户列表数据
export function getUsersData(query, pagenum, pagesize) {
    return request({
        url: 'users',
        method: 'get',
        params: {
            query,
            pagenum,
            pagesize
        }
    })
}

// 添加用户
export function addUser(param) {
    return request({
        url: 'users',
        method: 'post',
        data: param
    })
}

// 修改用户状态
export function putUser(uid, type) {
    return request({
        url: `users/${uid}/state/${type}`,
        method: 'put'
    })
}

// 根据id查询当前编辑用户的信息
export function getEditUser(id) {
    return request({
        url: `users/${id}`,
        method: 'get'
    })
}

// 编辑用户提交
export function putEditUser(param) {
    return request({
        url: `users/${param.id}`,
        method: 'put',
        data: param
    })
}

// 根据id删除单个用户
export function removeUser(id) {
    return request({
        url: `users/${id}`,
        method: 'delete'
    })
}

// 分配用户角色
export function distRule(id, rid) {
    return request({
        url: `users/${id}/role`,
        method: 'put',
        data: {
            rid
        }
    })
}

// 获取角色列表
export function getRolesList() {
    return request({
        url: 'roles',
        method: 'get'
    })
}