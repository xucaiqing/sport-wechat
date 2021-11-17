// index.js
// 获取应用实例
import Toast from '@vant/weapp/toast/toast';
import {setOpenid, uploadUserInfo,getPhone,setMyTeam} from "../../utils/user.js"
import {loadTeam} from "../../utils/clockIn";
const app = getApp();

Page({
  data: {
    motto: '请授权手机号登录',
    userInfo: {},
    avatar:"",
    realName:"",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: true,
    showView:false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    array: ['品牌营销部', '法务部', '信息中心', '总裁办','新零售','服配实现中心','物资采购部','人力资源中心','财务中心','商品计划部','物流管理部','用户运营部','工程行政部','销售运营部','商品企划中心','陈列创意部','拓展部'],
    objectArray: [],
    myTeam: "",
    showLoading: false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showLoading(){
    this.setData({ showLoading: true });
  },
  hideLoading(){
    this.setData({ showLoading: false });
  },

  onLoad() {
    this.showLoading()
    var that = this;
    console.log("login  onload");
    setOpenid(this, true).then(res => {
      console.log("页面获取缓存内容", res);
      const hasPhone = wx.getStorageSync('hasPhone');
      const hasUserInfo = wx.getStorageSync('hasUserInfo');
      const hasTeam = wx.getStorageSync('hasTeam');
      const avatar = wx.getStorageSync('avatar');
      this.setData({
        hasUserInfo: hasUserInfo === 1? true : false,
        hasPhone: hasPhone === 1? true : false,
        hasTeam: hasTeam === 1? true : false,
        avatar,
        openid: wx.getStorageSync('openid'),
        sessionKey: wx.getStorageSync('sessionKey')
      });
      console.log("1111111");
      if (hasTeam !== 1) {
        loadTeam().then(res => {
          console.log("加载到的团队信息");
          this.setData({
            objectArray: res.data.data
          })
        })
      }
      this.hideLoading();
    });
    
  },
  jump(){
    if (!this.data.hasTeam) {
       if (this.data.myTeam) {
        setMyTeam({
          openid: this.data.openid,
          myTeam: this.data.myTeam
        }).then(res => {
          if (res.data.rspCode === 1) {
           wx.switchTab({
             url: '../index/index',
           })  
           wx.setStorageSync('hasTeam', 1)
          }else{
            Toast.fail(res.data.rspMsg);
          }
        })
       }else {
        Toast.fail("请选择团队");
       }
    }else{
      wx.switchTab({
        url: '../index/index',
      })  
    }
  },
  bindGetUserInfo (e) {
    var that = this;
    that.setData({
      result:'ok',// 结果
      nickName:e.detail.userInfo.nickName,// 微信昵称
      avatarUrl:e.detail.userInfo.avatarUrl,// 微信头像
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        wx.setStorageSync('hasUserInfo', 1);
        uploadUserInfo(res.userInfo).then(suc => {
          if(suc.data.rspCode === 1){
            this.setData({
              avatar: res.userInfo.avatarUrl,
              hasUserInfo: true
            })
            console.log("uploadUserInfo", res);
          }else{
            Toast.fail("网络异常")
          }
        }).catch(res => {
          Toast.fail("网络异常")
        })
      },
      fail:function(){
        // 授权失败
        Toast.fail("拒绝授权用户信息")
    }

    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //通过绑定手机号登录
  getPhoneNumber: function (e) {
    console.log("getPhoneNumber", e);
    var iv = e.detail.iv
    var encryptedData = e.detail.encryptedData
    var sessionKey = wx.getStorageSync('sessionKey')
    var that = this;
    if(iv && encryptedData){
      getPhone({
        iv,encryptedData,sessionKey,openid: that.data.openid
      }).then(res => {
        if (res.data.rspCode === 1) {
          that.setData({
            realName: res.data.data.title,
            hasPhone: true
          })
          wx.setStorageSync('hasPhone', 1);
        }else{
          Toast.fail("无权限进入，手机号不在该企业内");
        }
      })
    }else{
      Toast.fail("根据手机号确认您是否在该企业内，请先授权")
    }
    //------执行Login---------
      //-----------------是否授权，授权通过进入主页面，授权拒绝则停留在登陆界面
 },

 bindPickerChange: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    index: e.detail.value,
    myTeam: this.data.objectArray[e.detail.value].id
  })
},


})
