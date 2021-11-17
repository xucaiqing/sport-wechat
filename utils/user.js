import {hostName,code2sessionUrl,updateWxStepsUrl,uploadUserInfoUrl,desWxMobileUrl,setTeamIdUrl } from "./env.config.js";
import {request} from './request.js';
import Toast from '@vant/weapp/toast/toast';
export async function getOpenid() {
    return new Promise((reslove, reject) => {
        wx.login({
            async success(code) {
                if(code.code){
                    request({
                        url: hostName + code2sessionUrl,
                        data: {
                            code: code.code
                        }
                    })
                    .then(res => {
                        reslove(res)
                    })
                    .catch(res => {
                        reject(res)
                    });
                }
            },
            async fail(res){
                reject(res)
            }
        })
    });
}
export async function uploadUserInfo(userInfo){
    userInfo['openid'] = wx.getStorageSync('openid');
    return await request({
        method: 'POST',
        url: hostName + uploadUserInfoUrl,
        data: userInfo
    })
}

export async function getWxSteps(openid, sessionKey){
    return new Promise((reslove, reject) => {
        wx.getWeRunData({
            async success(runRes){
                request({
                    url: hostName + updateWxStepsUrl,
                    method: 'POST',
                    data: {
                        encryptedData: runRes.encryptedData,
                        iv: runRes.iv,
                        sessionKey: sessionKey,
                        openid: openid
                    }
                }).then(res => {
                    reslove(res);
                }).catch(res => {
                    reject(res);
                })
            }, 
            async fail(loginRes){
                reject(loginRes)
            }
        });
    })
}
export async function getPhone(param){
    return await request({
        method: 'POST',
        url: hostName + desWxMobileUrl,
        data: param
    })
}

export async function setOpenid(that, login) {
    return new Promise(reslove => {
        const openid = wx.getStorageSync('openid');
        const sessionKey = wx.getStorageSync('sessionKey')
        console.log("login ? ", login);
        if(!openid || login){
            userLogin(login).then(res => {
                console.log("登录完成");
                that.setData({
                    openid: res.data.data.openid,
                    sessionKey: res.data.data.sessionKey
                })
                reslove(1);
            });
            console.log("ssssss");
        }else {
            that.setData({
                openid ,
                sessionKey
            })
            reslove(1);
        }
        
    })
    
}
async function userLogin(login) {
    return new Promise((resolve, reject) => {
      if (!wx.getStorageSync('openid') || login) {
        getOpenid().then(res => {
          wx.setStorageSync('openid', res.data.data.openid);
          wx.setStorageSync('sessionKey',res.data.data.sessionKey);
          wx.setStorageSync('hasPhone', res.data.data.hasPhone);
          wx.setStorageSync('hasUserInfo', res.data.data.hasUserInfo);
          wx.setStorageSync('hasTeam', res.data.data.hasTeam);
          wx.setStorageSync('avatar', res.data.data.avatar);
          console.log("获取openid成功 存入缓存成功");
          resolve(res);
        }).catch(res => {
            Toast.fail("网络异常");
            reject(res);
        })
      }else{
        resolve(error);
      }
    })
}
export async function setMyTeam(param) {
    return await request({
        url: hostName + setTeamIdUrl,
        data: param
    })
}
