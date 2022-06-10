import { request } from './request'

// 添加角色
export function addRolesData(param) {
    return request({
        url: 'roles',
        method: 'post',
        data: param
    })
}

// 根据 ID 查询角色
export function accordIdRolesForm(id) {
    return request({
        url: `roles/${id}`,
        method: 'get'
    })
}

// 编辑提交角色
export function putEditRoles(param) {
    return request({
        url: `roles/${param.roleId}`,
        method: 'put',
        data: {
            roleName: param.roleName,
            roleDesc: param.roleDesc
        }
    })
}

// 删除角色
export function removeRole(id) {
    return request({
        url: `roles/${id}`,
        method: 'delete'
    })
}


// 获取所有权限列表数据
export function getRightsData(type) {
    return request({
        url: `rights/${type}`,
        method: 'get'
    })
}

// 角色授权
export function getRolesRights(roleId, rids) {
    return request({
        url: `roles/${roleId}/rights`,
        method: 'post',
        data: {
            rids
        }
    })
}

// 删除角色指定权限
export function removeRoleRight(roleId, rightId) {
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}