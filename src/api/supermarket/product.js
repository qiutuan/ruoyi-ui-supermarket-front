import request from '@/utils/request'

// 查询商品列表
export function listProduct(query) {
  return request({
    url: '/supermarket/product/list',
    method: 'get',
    params: query
  })
}

// 查询商品详细
export function getProduct(productId) {
  return request({
    url: '/supermarket/product/' + productId,
    method: 'get'
  })
}

// 新增商品
export function addProduct(data) {
  return request({
    url: '/supermarket/product',
    method: 'post',
    data: data
  })
}

// 修改商品
export function updateProduct(data) {
  return request({
    url: '/supermarket/product',
    method: 'put',
    data: data
  })
}

// 删除商品
export function delProduct(productId) {
  return request({
    url: '/supermarket/product/' + productId,
    method: 'delete'
  })
}
