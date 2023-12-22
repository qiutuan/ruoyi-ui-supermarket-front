import request from '@/utils/request'

// 查询收银台列表
export function listCheckstand(query) {
  return request({
    url: '/supermarket/checkstand/list',
    method: 'get',
    params: query
  })
}

// 查询收银台详细
export function getCheckstand(recordId) {
  return request({
    url: '/supermarket/checkstand/' + recordId,
    method: 'get'
  })
}

// 新增收银台
export function addCheckstand(data) {
  return request({
    url: '/supermarket/checkstand',
    method: 'post',
    data: data
  })
}

// 修改收银台
export function updateCheckstand(data) {
  return request({
    url: '/supermarket/checkstand',
    method: 'put',
    data: data
  })
}

// 删除收银台
export function delCheckstand(recordId) {
  return request({
    url: '/supermarket/checkstand/' + recordId,
    method: 'delete'
  })
}
