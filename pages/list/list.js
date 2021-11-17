import {setOpenid} from "../../utils/user";
import {loadRankList} from "../../utils/clockIn";
import Toast from '@vant/weapp/toast/toast';
var app = getApp()
Page( {
  data: {
    sportTime: 2.0,
    stepNum: 0,
    encourageCount: 0,
    totalDays:0,
    myRank: "-",
    openid: "",
    sessionKey: "",
    timeType: 1,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    currentState: 1,
    num:2,
    menuList:[{id:1,menuName:'今日排行'},{id:2,menuName:'当月排行'},{id:3,menuName:'累计排行'}],
    dataList:[],
    showLoading:false
  },

  mySort:function(e){
    console.log("条件改变", e.currentTarget.dataset.num);
    this.setData({
      num: e.currentTarget.dataset.num
    })
    this.loadRank(this.data.num, this.data.timeType)
  },
  onLoad: function() {
    var that = this;
    setOpenid(this).then(res =>{
      console.log("加载openid成功")
    })
    /**
     * 获取系统信息
     */
    wx.getSystemInfo( {
      success: function( res ) {
        that.setData( {
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
  },
  onShow(){
    this.loadRank(this.data.num,this.data.timeType)
  },
  loadRank(type,timeType){
    var that = this
    that.showLoading();
    that.setData({
      dataList: []
    })
    loadRankList({
      openid: that.data.openid,
      type: type,
      timeType: timeType,
      group: that.data.currentTab
    }).then(res => {
      if (res.data.rspCode === 1){
        console.log("加载排行榜成功", res);
        const myRank = res.data.data.myRank;
        const sportTime =  res.data.data.sportTime
        const totalDays = res.data.data.totalDays;
        const stepNum = res.data.data.stepNum;
        const encourageCount = res.data.data.encourageCount;
        const dataList = res.data.data.rankList
        that.setData({
          myRank,
          sportTime,
          totalDays,
          stepNum,
          encourageCount,
          dataList
        })
        that.hideLoading();
      }else {
        Toast.fail("网络异常")
        that.hideLoading();
      }
    }).catch(res => {
      that.hideLoading();
    })
  },
  changeTime(e){
    console.log("changeTime", e);
    if (this.data.num == 5 && e.detail.name == 1) {
      this.setData({
        num: 2
      })
    }
    this.setData({
      timeType: e.detail.name,
      currentState:  e.detail.name
    })
    this.loadRank(this.data.num,this.data.timeType)
  },
  /**
     * 滑动切换tab
     */
  bindChange: function( e ) {
    console.log("个人团队切换", e);
    var that = this;
    that.setData( {
      num: 2,
      currentState:  1,
      currentTab: e.detail.current
      });
    this.loadRank(this.data.num,this.data.timeType)
  },
  /**
   * 点击tab切换
   */
  swichNav: function( e ) {
    console.log("点击切换");
    var that = this;
      that.setData( {
        num: 2,
        currentState:  '1',
        currentTab: e.target.dataset.current
      })
    
  },
  showLoading(){
    console.log("开启加载");
    this.setData({ showLoading: true });
  },
  hideLoading(){
    console.log("关闭加载");
    this.setData({ showLoading: false });
  },

})
