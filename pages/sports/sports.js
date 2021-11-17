// pages/sports/sports.js
import { setOpenid } from "../../utils/user.js"
import Toast from '@vant/weapp/toast/toast';
import { uploadImg,submitClockIn } from "../../utils/clockIn.js";
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayIsClockIn: 0,
    todayAllClockInCount: 0,
    userClockInCount: 0,
    clockInList: [],
    option1: [
      { text: '0.5小时', value: 0.5 },
      { text: '1小时', value: 1 },
      { text: '1.5小时', value: 1.5 },
      { text: '2小时', value: 2 },
      { text: '2.5小时', value: 2.5 },
      { text: '3小时', value: 3 },
      { text: '3.5小时', value: 3.5 },
      { text: '4小时', value: 4 },
      { text: '4.5小时', value: 4.5 },
      { text: '5小时', value: 5 },
      { text: '5.5小时', value: 5.5 },
      { text: '6小时', value: 6 },
    ],
    value1: 1,
    fileList: [
    ],
    sportType: "篮球",
    openid: null,
    calorie: 100,
    cal: 100,
    supplementary: 0,
    date: "2021-10-26",
    canSumbit: false
  },
  optionChange(value) {
    this.setData({
      value1: value.detail,
      calorie: this.data.cal * value.detail
    })
  },
  afterRead(event) {
    const that = this
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    uploadImg(file.url).then(res => {
      const data = JSON.parse(res.data)
      const list = [];
      console.log(data)
      const s = data.data
      const url = {url:s, deletable: true}
      list.push(url);
      console.log("tupian liebiao ", list)
      that.setData({
        fileList: list
      })
    }).catch(res => {
      Toast.fail("图片上传失败，请稍后重试！")
    })
  },

    // 删除图片

    delImgs(event) {
      console.log(event)
      let imgDelIndex = event.detail.index
      let fileList = this.data.fileList
      fileList.splice(imgDelIndex,1)
      console.log('删除图片的',fileList)
      this.setData({
        fileList
      })

  },
  // 运动打卡
  bindViewTap() {
    this.setData({
      canSumbit: true
    })
    console.log("运动时长", this.data.value1);
    const  req = {
      "openid":this.data.openid,
      "sportTime": this.data.value1,
      "sportType": this.data.sportType,
      "calorie": this.data.calorie + "卡",
      "imgUrl": this.data.fileList[0] ? this.data.fileList[0].url : null,
      "supplementary" : this.data.supplementary, // 是否为补签 0否 1 是
      "extraClock": this.data.todayIsClockIn, // 是否为 补充额外内容
      "clockDate": this.data.date // 仅当为 补签 时 生效
    }
    submitClockIn(req).then(res => {
      if(res.data.rspCode === 1){
        
        console.log("打卡成功 res ", res);
        if (req.supplementary == 0) {
          Toast('打卡成功');
          setTimeout(function() {
            console.log('doSomething')
            wx.switchTab({
              url: '../index/index'
            })
         }, 500);
          
        }else{
            Toast('补卡成功');
            setTimeout(function() {
              console.log('doSomething')
              wx.navigateTo({
                url: '../clockRecord/clockRecord?date=' + this.data.date
              })
           }, 500);
            
        }
         this.setData({
          canSumbit: false
        })
      }else if (res.data.rspCode === 50011){
        Toast("注意休息，请6：00之后再来打卡");
        this.setData({
          canSumbit: false
        })
      }else{
        Toast.fail(res.data.rspMsg);
        this.setData({
          canSumbit: false
        })
      }
     
    }).catch(res => {
      Toast.fail('网络异常');
    })
    console.log( "打卡",req);

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
    console.log(options);
    var createTime = util.formatDay(new Date()) ;
    this.setData({
      createTime : createTime ,
      date: createTime,
      sportType: options.sportType,
      todayIsClockIn: options.todayIsClockIn,
      calorie: options.cal,
      cal: options.cal,
      supplementary: options.supplementTimes
    })
    if (options.date) {
      this.setData({
        date: options.date,
        createTime: options.date
      })
    }
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

  },


})
