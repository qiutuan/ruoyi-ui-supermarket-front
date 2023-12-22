import request from '@/utils/request'

// 查询营收统计列表
export function listRevenueStatistics(query) {
  return request({
    url: '/supermarket/revenueStatistics/list',
    method: 'get',
    params: query
  })
}

// 查询营收统计详细
export function getRevenueStatistics(statId) {
  return request({
    url: '/supermarket/revenueStatistics/' + statId,
    method: 'get'
  })
}

// 新增营收统计
export function addRevenueStatistics(data) {
  return request({
    url: '/supermarket/revenueStatistics',
    method: 'post',
    data: data
  })
}

// 修改营收统计
export function updateRevenueStatistics(data) {
  return request({
    url: '/supermarket/revenueStatistics',
    method: 'put',
    data: data
  })
}

// 删除营收统计
export function delRevenueStatistics(statId) {
  return request({
    url: '/supermarket/revenueStatistics/' + statId,
    method: 'delete'
  })
}
