import request from '@/utils/request'

// 查询商品分类管理列表
export function listCategory(query) {
  return request({
    url: '/supermarket/category/list',
    method: 'get',
    params: query
  })
}

// 查询商品分类管理详细
export function getCategory(categoryId) {
  return request({
    url: '/supermarket/category/' + categoryId,
    method: 'get'
  })
}

// 新增商品分类管理
export function addCategory(data) {
  return request({
    url: '/supermarket/category',
    method: 'post',
    data: data
  })
}

// 修改商品分类管理
export function updateCategory(data) {
  return request({
    url: '/supermarket/category',
    method: 'put',
    data: data
  })
}

// 删除商品分类管理
export function delCategory(categoryId) {
  return request({
    url: '/supermarket/category/' + categoryId,
    method: 'delete'
  })
}
