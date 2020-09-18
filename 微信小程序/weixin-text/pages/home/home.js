// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: 'page/component/pages/swiper/swiper',
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 1000,
    duration: 500,
    swiperList: [{
        index_pic: '../../images/01.jpg',
        title: '第1张图'
      },
      {
        index_pic: '../../images/02.jpg',
        title: '第2张图'
      },
      {
        index_pic: '../../images/03.jpg',
        title: '第3张图'
      },
      {
        index_pic: '../../images/04.jpg',
        title: '第4张图'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      nbTitle: '新标题',
      nbLoading: true,
      nbFrontColor: '#ffffff',
      nbBackgroundColor: '#000000',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})