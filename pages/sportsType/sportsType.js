// pages/sportsType/sportsType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayIsClockIn:0,
    supplementTimes: 0,
    date: "2021-10-26"
  },
  bindViewTap(type) {
    console.log(type);
    const day = this.data.date ? this.data.date:''
    const rrr = '../sports/sports?sportType=' 
    + type.currentTarget.dataset.sporttype + "&cal=" + type.currentTarget.dataset.cal + "&todayIsClockIn=" + this.data.todayIsClockIn + '&supplementTimes=' + this.data.supplementTimes + "&date=" + day
    console.log(rrr);
    wx.navigateTo({
      url: '../sports/sports?sportType=' 
        + type.currentTarget.dataset.sporttype + "&cal=" + type.currentTarget.dataset.cal + "&todayIsClockIn=" + this.data.todayIsClockIn + '&supplementTimes=' + this.data.supplementTimes + "&date=" + day
    })
  },
  onClickLeft() {
    wx.navigateBack({
      delta: 2
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("运动类型页 参数", options);
    this.setData({
      todayIsClockIn:options.todayIsClockIn,
      supplementTimes: options.supplementTimes,
      date: options.date
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})