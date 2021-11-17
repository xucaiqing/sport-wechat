export function request(params) {
  return new Promise((resolve, reject) => {
    wx.request({
        ...params,
        success: result => {
          console.log("请求成功",result);
          if (result.data.rspCode == 9999) {
            console.log("用户登录信息异常========");
            wx.setStorageSync('hasPhone', 0)
            wx.navigateTo({
              url: '../login/login'
            })
          }
          resolve(result);
        },
        fail: err => {
          console.log("请求失败",err);
            reject(err);
        }
    });
  });
}
