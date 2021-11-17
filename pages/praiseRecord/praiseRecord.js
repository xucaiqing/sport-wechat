// pages/praiseRecord/praiseRecord.js
import { setOpenid } from "../../utils/user";
import {loadEncourageInfo} from "../../utils/clockIn";
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    encourageList:[],
    openid: "",
    sessionKey: ""
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 2
    }).then(res => {
      console.log("qqqqqqqqqqqq");
      var page = getCurrentPages().pop();
      if (page == undefined || page == null) return;
      page.onLoad();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
    var that = this;
    loadEncourageInfo(this.data.openid).then(res => {
      console.log("加载鼓励列表成功", res);
      that.setData({
        encourageList: res.data.data
      })
      console.log(that.data.encourageList);
    }).catch(res => {
      console.log("加载失败",  res);
      Toast.fail("鼓励列表加载失败");
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})