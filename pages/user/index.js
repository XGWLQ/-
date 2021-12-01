// pages/user/index.js
Page({
  /**
 * 页面的初始数据
 */
  data: {
    userInfo: {},
    // 收藏商品的数量
    collectNum: 0
  },
  onShow () {
    // 页面显示的时候获取用户数据
    const userInfo = wx.getStorageSync("userinfo")
    // 获取缓冲中的收藏数据
    const collect = wx.getStorageSync("collect") || []
    let { collectNum } = this.data
    // 获取数据
    collectNum = collect.length
    this.setData({
      userInfo,
      collectNum
    })

  },
  // 用户退出
  handleLoginOut () {
    wx.showModal({
      title: '退出',
      content: '是否退出登录',
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          this.setData({
            userInfo: ""
          })
          wx.showToast({
            title: '登出成功',
            mask: false
          })
        }
      }
    });

  }
})