import request from '@/utils/request'

// 查询交易记录列表
export function listTransactionRecord(query) {
  return request({
    url: '/supermarket/transactionRecord/list',
    method: 'get',
    params: query
  })
}

// 查询交易记录详细
export function getTransactionRecord(recordId) {
  return request({
    url: '/supermarket/transactionRecord/' + recordId,
    method: 'get'
  })
}

// 新增交易记录
export function addTransactionRecord(data) {
  return request({
    url: '/supermarket/transactionRecord',
    method: 'post',
    data: data
  })
}

// 修改交易记录
export function updateTransactionRecord(data) {
  return request({
    url: '/supermarket/transactionRecord',
    method: 'put',
    data: data
  })
}

// 删除交易记录
export function delTransactionRecord(recordId) {
  return request({
    url: '/supermarket/transactionRecord/' + recordId,
    method: 'delete'
  })
}
