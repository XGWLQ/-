import { requset } from '../../request/index.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情数据
    goodDetail: {},
  },

  // 商品对象
  GoodsObj: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options
    this._getGoodDetailList(goods_id)

  },
  async _getGoodDetailList (goods_id) {
    const { data } = await requset({ url: '/goods/detail', data: { goods_id } })
    // 保存商品信息
    this.GoodsObj = data.message
    //  用到的数据不用那么多，只需要存储用用到的数据
    this.setData({
      goodDetail: {
        goods_name: data.message.goods_name,
        goods_price: data.message.goods_price,
        /* 
        替换符富文本中的 .webp 因为iphone 不支持这种格式
        两种方式 
          1、和后台沟通 能不能换
          2、自己把后缀名替换掉
        
        */
        goods_introduce: data.message.goods_introduce.replace(/\.webp/g, ".jpg"),
        pics: data.message.pics
      }
    })
  },

  // 点击查看大图
  handlePrevewImage (e) {
    /* 
      current: '', // 你点击出来大哪一张图片
      urls: [], //要展示的图片数组
     */
    const { url } = e.currentTarget.dataset

    const urlarr = this.data.goodDetail.pics.map(v => v.pics_mid)
    wx.previewImage({
      current: url,
      urls: [...urlarr],
    });
  },

  // 点击添加商品
  hanbleCartAdd () {
    /**
     * 1、绑定事件
     * 2、获取缓存中的购物车数据
     * 3、判断当前商品是否存在于购物车中
     * 4、如果存在 上平数量加1 
     * 5、不存在 将该商品添加到购物出中
     * 6、存到缓存中
     * 7、弹出提示信息
     */

    // 、获取缓存中的购物车数据 刚开始可能没有
    const cart = wx.getStorageSync("cart") || [];
    // 判断当前商品是否存在于购物车中 
    // 找缓存中是否有改商品
    let index = cart.findIndex(v => v.goods_id === this.GoodsObj.goods_id)
    console.log(index);

    if (index === -1) {//没有
      // 不存在 将该商品添加到购物出中
      this.GoodsObj.num = 1
      cart.push(this.GoodsObj)
    } else {// 有
      // 如果存在 缓存中对应cart上平数量加1 
      cart[index].num++
    }
    // 、存到缓存中
    wx.setStorageSync('cart', cart)

    // 提示信息
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      // 防抖 防止用户多点 会有1.5秒的缓冲时间
      mask: true
    });
  }
})