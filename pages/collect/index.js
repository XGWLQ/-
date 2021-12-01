/*
 * @Author: your name
 * @Date: 2021-10-27 17:14:04
 * @LastEditTime: 2021-11-02 16:41:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \黑马优购\pages\collect\index.js
 */
// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // tab数据
    tabs: [
      {
        id: 0,
        name: "商品收藏",
        isClick: true
      },
      {
        id: 1,
        name: "品牌收藏",
        isClick: false
      },
      {
        id: 2,
        name: "店铺收藏",
        isClick: false
      },
      {
        id: 3,
        name: "浏览足迹",
        isClick: false
      }
    ],
    // 收藏商品的数量
    collectList: []
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 在页面显示的是时候拿到缓存中的数据
    // 获取缓冲中的收藏数据
    const collectList = wx.getStorageSync("collect") || []
    this.setData({
      collectList
    })
  },

  // 点击标题切换效果

  handleTabChenge (e) {
    const { tabs } = this.data
    const { index } = e.detail

    tabs.forEach((v, i) => {
      return i === index ? v.isClick = true : v.isClick = false
    })
    this.setData({
      tabs
    })
  }
})