import request from '../utils/request'
import rsa from '../utils/crtypto/rsa'
import aes from '../utils/crtypto/aes'
import { parseTime } from '../utils'
import crypto from 'crypto'
function formatPsw(username, rawPsw) {
  if (rawPsw === passwordCache(username)) {
    rawPsw = aes.decrypt(getLoginSetting().password)
  }
  const md5 = crypto.createHash('md5')
  md5.update(username)
  var tmpraw = parseTime(new Date(), '{yyyy}{mm}{dd}') + rawPsw + md5.digest('hex')
  return rsa.encrypt(tmpraw)
}
const dic_loginSetting = 'login.setting'
const dic_passwordCache = '##password.cache.inmemory##'
export function getLoginSetting() {
  var s = localStorage.getItem(dic_loginSetting)
  var p = JSON.parse(s)
  if (!p) p = {}
  return p
}
export function setLoginSetting(val) {
  if (!val) val = {}
  val.password = val.password === passwordCache(val.username) ? getLoginSetting().password : aes.encrypt(val.password)
  localStorage.setItem(dic_loginSetting, JSON.stringify(val))
}
export function passwordCache(username) {
  const c = crypto.createHash('sha1')
  return c.update(dic_passwordCache + username).digest('hex')
}
/**
 * 登录账号
 * @param { {
 * username: String,
 * password: any,
 * RememberMe: Boolean,
 * Verify: { Code: any }
 * } } params
 */
export function login(params) {
  params.password = formatPsw(params.username, params.password)
  return request.post('account/login', params)
}

/**
 * 登出
 */
export function logout() {
  return request.post('account/logout')
}

/**
 * 移除用户
 * @param { {
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String
 * }
 * } } params
 */
export function removeAccount(params) {
  return request.delete('account/Remove', params)
}

/**
 * 注册
 *
 * @export
 * @param {*} params
 * @returns
 */
export function regnew(params) {
  // 注册接口暂时不使用加密
  // params.password = formatPsw(params.username, params.password)
  // params.confirmpassword = formatPsw(params.username, params.confirmpassword)
  return request.post('account/register', params)
}

/**
 * 修改用户密码
 * @param {*} params
 */
export function accountPassword(params) {
  params.newPassword = formatPsw(params.id, params.newPassword)
  params.confirmNewPassword = formatPsw(params.id, params.confirmNewPassword)
  params.oldPassword = formatPsw(params.id, params.oldPassword)
  return request.post('/account/password', params)
}

/**
 * 获取用户信息
 * @description 在account的api中用来验证用户是否登录，并且实时更新用户的基本信息
 */
export function getUserInfo() {
  return request.get('/users/base')
}

/**
 * 获取权限
 * @param {{
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String
 * },
 * }} params
 */
export function getPermission(params) {
  return request.get('account/Permission', {
    params
  })
}

/**
 * 新增权限
 * @param {{
 * id: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String,
 * },
 * newPermission: String
 * }} params
 */
export function postPermission(params) {
  return request.post('account/Permission', params)
}

/**
 * 修改授权码
 * @param { {
 * NewKey: String,
 * ModifyUserId: String,
 * Auth: {
 *   Code: String,
 *   AuthByUserID: String,
 * },
 * } } params
 */
export function postAuthKey(params) {
  return request.post('account/AuthKey', params)
}

/**
 * 获取授权码
 */
export function getAuthKey(ignoreErr) {
  return request.get('account/AuthKey', { respondErrorIngore: ignoreErr })
}

/**
 * 检查授权码正确性
 *
 * @export
 * @param {*} authByUserId
 * @param {*} code
 * @param {Boolean} ignoreErr
 * @returns
 */
export function checkAuthCode(authByUserId, code, ignoreErr) {
  return request.post('account/checkAuthCode', {
    Auth: {
      authByUserId,
      code
    }
  })
}

/**
 * 授权未认证用户，需要登录
 *
 * @export
 * @param {*} username
 * @param {*} valid
 */
export function authUserRegister(username, valid) {
  return request.post('/account/authUserRegister', {
    username,
    valid
  })
}

/**
 * 注册
 *
 * @export
 * @param {*} params
 * @returns
 */
export function modefyUser(params) {
  // 注册接口暂时不使用加密
  // params.password = formatPsw(params.username, params.password)
  // params.confirmpassword = formatPsw(params.username, params.confirmpassword)
  return request.post('account/modefyUser', params)
}

export function signIn(signInId) {
  return request.get('signIn/signIn', {
    params: {
      signInId
    }
  })
}

/**
 * 报告日志
 *
 * @export
 * @param {*} username
 * @param {*} msg
 * @param {*} rank Debug = 32,
		///Infomation = 16,
		///Warning = 8,
		///Danger = 4,
		///Disaster = 0
 * @returns
 */
export function report(username, msg, rank) {
  return request.post('log/report', {
    params: {
      username,
      message: msg,
      rank
    }
  })
}

/**
 * 查询时间范围内 日志
 *
 * @export
 * @param {*} username
 * @param {*} startDate
 * @param {*} endDate
 * @param {*} rankArr Debug = 32,
		///Infomation = 16,
		///Warning = 8,
		///Danger = 4,
		///Disaster = 0
 * @returns
 */
export function getReport(username, startDate, endDate, page, rankArr, ip, device, message) {
  var date = startDate === null || endDate === null ? null : { start: startDate, end: endDate }
  return request.post('log/query', {
    userName: { value: username },
    date,
    rank: rankArr === null ? null : { arrays: rankArr },
    ip: ip === null ? null : { arrays: ip },
    device: device === null ? null : { arrays: device },
    message: message === null ? null : { value: message },
    page
  })
}

/**
 * 获取日志等级字典
 *
 * @export
 * @returns
 */
export function getReportDic() {
  return request.get('log/logRankDictionary')
}

export function getUserActionOperationDic() {
  return request.get('log/userActionOperationDictionary')
}
