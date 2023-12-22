import request from '@/utils/request'

// 查询商品分类管理列表
export function getEchartsMsg() {
  return request({
    url: '/supermarket/echarts',
    method: 'get',
  })
}