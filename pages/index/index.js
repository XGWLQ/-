/*
 * @Author: your name
 * @Date: 2021-10-27 17:06:15
 * @LastEditTime: 2021-11-07 23:15:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \黑马优购\pages\index\index.js
 */
// 使用封装的请求函数调用数据
import { requset } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 轮播图数组 用来存放获取到的轮播图数据
    swiperList: [],
    // 导航栏数组
    navList: [],
    // 楼层数据
    floorList: []
  },
  //options(Object)
  // 页面一加载就开始触发
  onLoad: function (options) {

    // // 1、发送异步请求获取轮播图数据
    // wx.request({
    //   // 接口地址
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   // 成功的回调
    //   success: (result)=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    // });
    this._getSwiperLisr()
    this._getNavList()
    this._getFloorList()
    //  

  },
  // 获取轮播图数组 优化后的
  async _getSwiperLisr () {
    const { data } = await requset({ url: '/home/swiperdata' })
    this.setData({
      swiperList: data.message
    })
  },
  // 获取导航栏数据
  async _getNavList () {
    const { data } = await requset({ url: '/home/catitems' })
    this.setData({
      navList: data.message
    })
  },
  // 获取楼层数据
  async _getFloorList () {
    const { data } = await requset({ url: '/home/floordata' })
    //  改变 拼接
    data.message.forEach(v => {
      v.product_list.forEach(item => {
        return item.navigator_url = item.navigator_url.replace(/goods_list/g, 'goods_list/index')
      })
    })
    this.setData({
      floorList: data.message
    })
  }

});