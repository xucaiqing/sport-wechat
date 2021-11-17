// pages/index/index.js
import {setOpenid,getWxSteps} from "../../utils/user.js"
import {loadMainInfo,loadClockInList,encourage,unEncourage} from "../../utils/clockIn";
import Toast from '@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    sessionKey: '',
    nickName:'梁芷芊',
    images: [],
    todayAllClockInCount: 0,
    userClockInCount: 0,
    clockInList: [],
    todayIsClockIn: 0,
    maxId: null,
    current: 1,
    isEnd: false,
    encourageCount: 0,
    showLoading: false,//展示加载
  },

  onClickLeft() {
    wx.navigateBack({
      delta: 3
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const that = this;
    setOpenid(this).then(res =>{
      this.setData({
        current: 1
      })
    });
    loadClockInList(that.data.current, that.data.openid,null,that.data.openid, options.date,1).then(res => {
      // list = list.concat(res.data.data.records);
      that.setData({
        clockInList: res.data.data.records,
        maxId: res.data.data.records[0].id,
        userClockInCount: res.data.data.records.length
      })
      console.log("clockInList", that.data.clockInList);
    }).catch(res => {
      console.log("获取列表失败",res);
    })
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
    // if(this.data.isEnd){
    //   console.log("查询完毕，不再查询");
    //   return;
    // }
    // var that = this;
    // var current = that.data.current + 1;
    // loadClockInList(current, that.data.openid, that.data.maxId, that.data.openid,that.data.date, 1).then(res => {
    //   // list = list.concat(res.data.data.records)
    //   if(res.data.data.records.length === 0){
    //     that.setData({
    //       isEnd: true
    //     })
    //   }
    //   that.setData({
    //     clockInList: res.data.data.records,
    //   })
    // }).catch(res => {
    //   console.log("获取列表失败",res);
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  
  
  showLoading(){
    this.setData({ showLoading: true });
  },
  hideLoading(){
    this.setData({ showLoading: false });
  },



})
