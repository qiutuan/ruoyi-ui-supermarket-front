import request from '@/utils/request'

// 查询供货记录列表
export function listSupplyRecord(query) {
  return request({
    url: '/supermarket/supplyRecord/list',
    method: 'get',
    params: query
  })
}

// 查询供货记录详细
export function getSupplyRecord(recordId) {
  return request({
    url: '/supermarket/supplyRecord/' + recordId,
    method: 'get'
  })
}

// 新增供货记录
export function addSupplyRecord(data) {
  return request({
    url: '/supermarket/supplyRecord',
    method: 'post',
    data: data
  })
}

// 修改供货记录
export function updateSupplyRecord(data) {
  return request({
    url: '/supermarket/supplyRecord',
    method: 'put',
    data: data
  })
}

// 删除供货记录
export function delSupplyRecord(recordId) {
  return request({
    url: '/supermarket/supplyRecord/' + recordId,
    method: 'delete'
  })
}
