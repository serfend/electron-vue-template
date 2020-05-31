import request from '@/utils/request'
import {
  getUserBase,
  getUserCompany,
  getUserDuties,
  getUserSocial,
  getUserDiy,
  getUserApplication
} from '@/api/user/userinfo'

/**
 * 获取我的管辖单位
 */
export function getOnMyManage() {
  return request.get('users/onMyManage')
}

/**
 * 新增管辖单位
 * @param { {
 * code: String,
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String
 * }
 * } } params 新增参数
 */
export function addMyManage(params) {
  return request.post('users/onMyManage', params)
}

/**
 * 移除管辖单位
 * @param {{
 * code: String,
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String
 * }
 * } } params 新增参数
 */
export function removeMyManage(params) {
  return request.delete('users/onMyMange', params)
}

/**
 * 一次性获取user所有的信息
 */
export function getUserAllInfo(id) {
  return new Promise((resolve, reject) => {
    Promise.all([
      getUserBase(id),
      getUserCompany(id),
      getUserDuties(id),
      getUserSocial(id),
      getUserDiy(id),
      getUserApplication(id)
    ]).then(([base, company, duties, social, diy, application]) => {
      var UserInfoes = {
        application,
        base,
        company,
        duties,
        social,
        diy
      }
      UserInfoes.base.base.time_Birthday = UserInfoes.base.base.time_BirthDay // bug prop name fix
      resolve(UserInfoes)
    }).catch(err => reject(err))
  })
}
