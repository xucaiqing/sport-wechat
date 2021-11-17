// pages/my/my.js
import {setOpenid} from "../../utils/user.js"
import {loadClockInList, loadMainInfo} from "../../utils/clockIn";
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'梁芷芊',
    avatar:"",
    images: [],
    total: 0,
    encourageCount:0,
    clockInList: [],
    todayIsClockIn: 0,
    openid: "",
    sessionKey: "",
    current:1,
    isEnd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that  = this;
    setOpenid(this);
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({isEnd:false, current: 1,  clockInList: []})
    console.log("重新加载");
    var that = this;
    loadMainInfo(this.data.openid,2).then(res => {
      if (res.data.rspCode === 1){
        that.setData({
          nickName: res.data.data.userName,
          userClockInCount: res.data.data.userClockInCount,
          encourageCount: res.data.data.encourageCount,
          avatar: res.data.data.avatarUrl
        })
      }
    }).catch(res => {
      console.log("加载信息失败")
      Toast.fail("网络异常");
    });
    loadClockInList(that.data.current, that.data.openid,null,that.data.openid,null,1).then(res => {
      const list= [];
      res.data.data.records.forEach(item => list.push(item))
      // list = list.concat(res.data.data.records);
      that.setData({
        clockInList: list,
        total: res.data.data.total,
        maxId: res.data.data.records[0].id
      })
    }).catch(res => {
      console.log("获取列表失败",res);
    })
  },
  jumpEncourageList(){
    wx.navigateTo({
      url: '../praiseRecord/praiseRecord'
    })  
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("触底，再查询");
    if(this.data.isEnd){
      console.log("查询完毕，不再查询");
      return;
    }
    var that = this;
    var current = that.data.current + 1;
    loadClockInList(current, that.data.openid,that.data.maxId, that.data.openid, null,1).then(res => {
      console.log("list", res);
      var list = that.data.clockInList;
      res.data.data.records.forEach(item => {
          list.push(item);
      })
      // list = list.concat(res.data.data.records)
      if(res.data.data.records.length === 0){
        that.setData({
          isEnd: true
        })
      }
      that.setData({
        clockInList: list,
        current: current
      })
    }).catch(res => {
      console.log("获取列表失败",res);
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
