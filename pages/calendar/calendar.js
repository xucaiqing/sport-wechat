const app = getApp()
const util = require('../../utils/util.js');
import {loadCalendar} from '../../utils/clockIn.js';
import {setOpenid} from "../../utils/user.js"
import Toast from '@vant/weapp/toast/toast';

Page({

/**
* 页面的初始数据
*/
data: {
  openid:"",
  sessionKey:"",
  objectId:'',
  days:[],
  signUp:[],
  cur_year:0,
  cur_month:0,
  count:0,
  list:[],
  todayYear: 0,
  todayMonth: 0,
  today:0,
  supplementTimes:0
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setData({objectId : options.objectId});
    const that = this;
    setOpenid(that);
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
      //获取当前年月
      const date = new Date();
      const cur_year = date.getFullYear();
      const today = date.getDate();
      const cur_month = date.getMonth() + 1;
      const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
      this.calculateEmptyGrids(cur_year, cur_month);
      this.calculateDays(cur_year, cur_month);
      //获取当前用户当前任务的签到状态
      this.setData({
      cur_year,
      cur_month,
      weeks_ch,
      todayYear: cur_year,
      todayMonth: cur_month,
      today
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

  },
  // 获取当月共多少天
  getThisMonthDays:function(year, month){
  return new Date(year, month, 0).getDate()
  },

  // 获取当月第一天星期几
  getFirstDayOfWeek:function(year, month) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },

  // 计算当月1号前空了几个格子，把它填充在days数组的前面
  calculateEmptyGrids:function(year, month) {
  var that = this;
  //计算每个月时要清零
  that.setData({days:[]});
  const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
  if (firstDayOfWeek > 0) {
  for (let i = 0; i < firstDayOfWeek; i++) {
  var obj = {
  date:null,
  sign: 0
  }
  that.data.days.push(obj);
  }
  this.setData({
  days:that.data.days
  });
  //清空
  } else {
  this.setData({
  days: []
  });
  }
  },

  //查询日历列表
  calculateDays(year, month) {
    var that = this
    const m =  month < 10? "0" + month: month;
    console.log("m", m);
    loadCalendar(this.data.openid, year + "-" + m ).then(res =>{
      if(res.data.rspCode === 1){
          console.log("res.data.data.clockInDateInfoList", res.data.data.clockInDateInfoList);
          var list = that.data.days.concat(res.data.data.clockInDateInfoList);
          console.log("supplementTimes", res.data.data.supplementTimes);
          that.setData({
            days: list,
            supplementTimes: res.data.data.supplementTimes
          })
      }else{
        Toast.fail("网络异常！");
      }
    })
  },



  //匹配判断当月与当月哪些日子签到打卡
  onJudgeSign:function(){
  var that = this;
  var signs = that.data.signUp;
  var daysArr = that.data.days;
  for (var i=0; i < signs.length;i++){
  var current = new Date(signs[i].date.replace(/-/g, "/"));
  var year = current.getFullYear();
  var month = current.getMonth()+1;
  var day = current.getDate();
  day = parseInt(day);
  for (var j = 0; j < daysArr.length;j++){
  //年月日相同并且已打卡
  if (year == that.data.cur_year && month == that.data.cur_month && daysArr[j].date == day && signs[i].sign == "今日已打卡"){
  daysArr[j].sign = true;
  }
  }
  }
  that.setData({days:daysArr});
  },

  // 切换控制年月，上一个月，下一个月
  handleCalendar:function(e) {
  const handle = e.currentTarget.dataset.handle;
  const cur_year = this.data.cur_year;
  const cur_month = this.data.cur_month;
  if (handle === 'prev') {
  let newMonth = cur_month - 1;
  let newYear = cur_year;
  if (newMonth < 1) {
  newYear = cur_year - 1;
  newMonth = 12;
  }
  this.calculateEmptyGrids(newYear, newMonth);
  this.calculateDays(newYear, newMonth);
  this.setData({
  cur_year: newYear,
  cur_month: newMonth
  })
  } else {
  let newMonth = cur_month + 1;
  let newYear = cur_year;
  if (newMonth > 12) {
  newYear = cur_year + 1;
  newMonth = 1;
  }
  this.calculateEmptyGrids(newYear, newMonth);
  this.calculateDays(newYear, newMonth);
  this.onGetSignUp();
  this.setData({
  cur_year: newYear,
  cur_month: newMonth
  })
  }
  },

  //获取当前用户该任务的签到数组
  onGetSignUp:function(){
  var that = this;

  },
  jumpClockRecord(e){

    console.log("跳转",e.currentTarget.dataset.day.date);
    const m =  this.data.cur_month < 10? "0" + this.data.cur_month: this.data.cur_month;
    const day = e.currentTarget.dataset.day.date < 10? "0" + e.currentTarget.dataset.day.date: e.currentTarget.dataset.day.date;
    wx.navigateTo({
      url: '../clockRecord/clockRecord?date=' + this.data.cur_year + "-" + m + "-" + day
     })
  },
  extra(e){
    console.log("补签",e);
    console.log("补签",e.currentTarget.dataset.day.date);
    console.log("补签",this.data.today);
    if( this.data.cur_year != this.data.todayYear){
      console.log("不是当年 不补签");
      return;
    }
    if( this.data.cur_month != this.data.todayMonth){
      console.log("不是当月 不补签");
      return;
    }
    if(e.currentTarget.dataset.day.date < this.data.today){
      if(this.data.supplementTimes <= 0){
        Toast.fail("没有补签次数");
        return;
      }
      console.log("可以补签");
      const m =  this.data.cur_month < 10? "0" + this.data.cur_month: this.data.cur_month;
      const day = e.currentTarget.dataset.day.date < 10? "0" + e.currentTarget.dataset.day.date: e.currentTarget.dataset.day.date;
      wx.navigateTo({
        url: '../sportsType/sportsType?todayIsClockIn=0&supplementTimes=1&date='+ this.data.cur_year + "-" + m + "-" + day
      })
    }
    if(e.currentTarget.dataset.day.date === this.data.today){
      console.log("今日，签到");
      wx.navigateTo({
        url: '../sportsType/sportsType?todayIsClockIn=0&supplementTimes=0'
      })
    }
  }
})
