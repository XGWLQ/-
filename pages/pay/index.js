/**
 * 1、获取本地中的购物车数据
 *  1、把购物车数据中checked 为true 的过滤出来
 *  */
// 使用封装的请求函数调用数据
import { requset } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowAddressBtn: true,
    // 存储收货地址
    address: {},
    // 购物车中的数据
    cart: [],
    // 总价格 总数量
    totalPrice: 0,
    totalNum: 0
  },
  // 页面显示的时候
  onShow () {
    // 1、判断本地存储是否有收货地址
    const address = wx.getStorageSync("address")
    // 获取本地存储中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 过滤购物车中数据
    cart = cart.filter(v => v.checked)
    // 将地址存储起来
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    // 将地址存储起来
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })

  },

  // 商品的支付功能
  async handleOrderPay () {
    try {
      // 需要获取用户的token 是否已经登录了
      const token = wx.getStorageSync("token")
      if (!token) {
        wx.navigateTo({ url: '/pages/auth/index' })
        this.showToast("请先授权登录")
        return
      }
      // 已经登录授权
      /* 
      1、创建订单
      2、设置请求头
      3、获取请求体
      */

      // 2、请求头
      // const header = { Authorization: token }
      // 3、请求体
      const order_price = this.data.totalPrice
      const { provinceName, cityName, countyName, detailInfo } = this.data.address
      const consignee_addr = provinceName + cityName + countyName + detailInfo
      let goods = []
      this.data.cart.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        })
      })
      const params = { order_price, consignee_addr, goods }
      // 4、发送请求 创建订单 获取订单编号 
      const { data } = await requset({ url: "/my/orders/create", data: params, method: "post" })
      //  4.1订单编号
      const { order_number } = data.message
      // 5、发起预支付接口 拿到他的pay值
      const { data: res } = await requset({ url: "/my/orders/req_unifiedorder", data: { order_number }, method: "post" })
      const { pay } = res.message
      // 6、调用接口发起支付
      wx.requestPayment({ ...pay })
      // 7、发起查看支付转态
      const { data: result } = await requset({ url: "/my/orders/chkOrder", data: { order_number }, method: "post" })
      // 8、删除缓存中已经支付过了的商品
      const newcart = wx.getStorageSync("cart")
      const cart = newcart.filter(v => !v.checked)
      wx.setStorageSync("cart", cart)

      wx.navigateTo({
        url: "/pages/order/index"
      })
      this.showToast("穷鬼还想买东西")
    } catch (error) {
      this.showToast("订单已支付")
    }
  },
  // 小程序获取地址方法
  handleChooseAddress () {
    // 有时候用户点击可可能是取消 后面就获取不到地址了
    // 1、获取状态
    wx.getSetting({
      success: (res) => {
        const scope = res.authSetting["scope.address"]
        // 点击确定 或者 没有调用过api
        if (!scope) {
          // 授权设置页面(wx.openSetting)
          wx.openSetting({
            success: (res) => { this.getChooseAddress() }
          })
        }
        this.getChooseAddress()
      }
    })
  },
  // 封装获取地址的api
  getChooseAddress () {
    wx.chooseAddress({
      success: (res) => {
        // 保存到本地存储
        wx.setStorageSync("address", res);
      }
    })
  },
  // 封装提示用户的弹窗
  showToast (title) {
    wx.showToast({
      title: title,
      icon: 'none',
    })
  }
})