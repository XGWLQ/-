import { requset } from '../../request/index.js';
import regeneratorRuntime, { async } from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab数据
    tabs: [
      {
        id: 0,
        name: "全部",
        isClick: true
      },
      {
        id: 1,
        name: "待付款",
        isClick: false
      },
      {
        id: 2,
        name: "待发货",
        isClick: false
      },
      {
        id: 3,
        name: "退款/退货",
        isClick: false
      }
    ],
    // 订单列表
    ordersList: []
  },
  /* 
    1 页面被打开的时候 onShow 
      0 onShow 不同于onLoad 无法在形参上接收 options参数 
      0.5 判断缓存中有没有token 
        1 没有 直接跳转到授权页面
        2 有 直接往下进行 
      1 获取url上的参数type
      2 根据type来决定页面标题的数组元素 哪个被激活选中 
      2 根据type 去发送请求获取订单数据
      3 渲染页面
    2 点击不同的标题 重新发送请求来获取和渲染数据 
 */
  // 获取数据
  onShow () {


    // 先判断是否有 token 如果没有先授权
    const token = wx.getStorageSync("token")
    if (!token) {
      // 跳转到授权页面
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return
    }

    /* 
      在show中是没有options 所以要使用 程序的页面栈-数组 getCurrentPages 最后一个就是当前页面
    */
    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面 
    const pages = getCurrentPages()
    // 2、数组最后一项就是当前页面
    const currentPage = pages[pages.length - 1]
    // 3获取到当前的参数
    const { type } = currentPage.options

    // 4 根据点击不同的链接显示不同的tab标题
    this.handelTabsItemClick(type - 1)

    // 获取订单数据
    this._getOrderList(type)
  },

  // 定义发数据的方法
  async _getOrderList (type) {
    const { data: res } = await requset({ url: "/my/orders/all", data: { type } })
    const { orders } = res.message
    this.setData({
      // 对时间进行处理
      ordersList: orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
    })
  },

  // 根据个人中心页面点击按钮切换不同的tab
  handelTabsItemClick (index) {
    let { tabs } = this.data
    tabs.forEach((v, i) => {
      return i === index ? v.isClick = true : v.isClick = false
    })
    this.setData({
      tabs
    })
  },
  // 点击tab改变
  handleTabChenge (e) {
    /* 
    1、获取tas数据
    2、获取被点击的title索引
    3、根据缩影修改tas中isClick的值
    */
    const { index } = e.detail
    // 调用改变isClick的方法
    this.handelTabsItemClick(index)
    // 求换tab时发送不同请求
    // 获取订单数据
    this._getOrderList(index + 1)
  },
})