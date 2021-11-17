import {hostName,loadIndexInfoUrl,queryClockInDetailsUrl,uploadImgUrl,
  submitClockInUrl,encourageUrl,unEncourageUrl,loadEncourageListUrl,loadCalendarUrl,loadTeamUrl,getRankList} from "./env.config.js";
import {request} from './request.js'

export async function loadMainInfo(openid, type){
  return await request({
    url: hostName  + loadIndexInfoUrl,
    data: {
      openid: openid,
      type: type
    }
  });
}

export async function loadClockInList(current, openid,maxId,listOpenid,clockInDate, querySupplementary){
  return await request({
    url: hostName + queryClockInDetailsUrl + "?openid=" + openid,
    method: "POST",
    data: {
      current: current,
      maxId: maxId,
      listOpenid: listOpenid,
      clockInDate: clockInDate,
      querySupplementary: querySupplementary
    }
  })
}
export async function uploadImg(filepath){
  return new Promise((reslove, reject) => {
    wx.uploadFile({
      url: hostName + uploadImgUrl,
      filePath: filepath,
      name: 'file',
      async success(res) {
        reslove(res);
      },
      async fail(res) {
        reject(res);
      }
    });
  })
}
export async function submitClockIn(param){
  console.log('打卡参数',param);
  return await request({
      url: hostName + submitClockInUrl,
      method: "POST",
      data: param
    })
}

export async function encourage(openid, clockid){
  return await request({
    url: hostName + encourageUrl,
      method: "GET",
      data: {
        openid: openid,
        clockInMasterId: clockid
      }
  });
}
export async function unEncourage(openid, clockid){
  return await request({
    url: hostName + unEncourageUrl,
    method: "GET",
    data: {
      openid: openid,
      clockInMasterId: clockid
    }
  });
}
export async function loadEncourageInfo(openid){
  return await request({
    method:"GET",
    url: hostName +loadEncourageListUrl,
    data: {
      openid: openid
    }
  })
}
export async function loadCalendar(openid, month){
  return await request({
    method:"GET",
    url: hostName +loadCalendarUrl,
    data: {
      openid: openid,
      month: month
    }
  })
}
export async function loadTeam(){
  return await request({
    url: hostName + loadTeamUrl
  })
}

export async function loadRankList(param) {
  return await request({
    url: hostName  + getRankList,
    data: param
  })
}
